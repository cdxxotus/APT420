import os
import json
try:
    from types import SingleNamespace as Namespace
except ImportError:
    # Fallback
    from argparse import Namespace


def create_object_from_json(json_content):
    try:
        return json.loads(json_content, object_hook=lambda data: Namespace(**data))
    except json.decoder.JSONDecodeError:
        # Couldn't parse the JSON.

        return None

class JSONCrashLog(object):
    
    osa_log_metadata_app_name_key = "name"
    osa_log_metadata_other_app_name_key = "app_name"
    osa_log_metadata_incident_key = "incident_id"
    osa_log_metadata_bug_type_key = "bug_type"
    osa_log_crash_payload_app_name_key = "procName"
    osa_log_crash_payload_other_app_name_key = "procName"
    osa_log_crash_payload_incident_key = "incident"
    osa_log_crash_payload_bug_type_key = "bug_type"
    
    # rdar://83760462
    # In instances where the crash log's IPS header is stripped away,
    # we should try to reconstitute a minimal representation of it.
    # Most of the information that we need for this is present in the
    # primary JSON crash payload. We can map the IPS header key to its
    # corresponding key in the crash payload and use these mappings to
    # rebuild the ips header.
    osa_metadata_key_to_crash_payload_key = {
        osa_log_metadata_app_name_key : osa_log_crash_payload_app_name_key,
        osa_log_metadata_other_app_name_key : osa_log_crash_payload_other_app_name_key,
        osa_log_metadata_incident_key : osa_log_crash_payload_incident_key,
        osa_log_metadata_bug_type_key : osa_log_crash_payload_bug_type_key
    }
    
    
    def is_ips_header_line(self, line):
        # The IPS header line can be identified if it doesn't contain any
        # entries that are certain to be found in a crash payload line.
        return not self.is_crash_payload_line(line)

    def is_crash_payload_line(self, line):
        # The crash payload should always have at least an 'incident' or
        # 'osVersion' field.
        return hasattr(line, 'incident') or hasattr(line, 'osVersion')

    def __init__(self, crash_log_file):
        
        self.ips_header = None
        self.crash = None
        self.reconstructed_fake_ips_header = False

        file_contents = crash_log_file.read()
        # First line of the JSON crash log contains the IPS header.
        # We still need to keep it around, but it's a separate
        # component.
        try:
            end_of_ips_header_index = file_contents.index('\n')
        except ValueError:
            # Couldn't find the newline. This is necessary for getting
            # at least the minimal information out of the crash log.
            return
        ips_header_contents = file_contents[:end_of_ips_header_index]

        # The remaining lines represent the actual crash
        if end_of_ips_header_index == len(file_contents) - 1:
            # There's only one line of data in the crash log.
            # It could either be the IPS header line or the crash payload.
            # Figure out which one of these it could be by checking
            # certain properties of the data.
            object_representation = create_object_from_json(ips_header_contents)
            if self.is_crash_payload_line(object_representation):
                self.crash = object_representation
            elif self.is_ips_header_line(object_representation):
                self.ips_header = object_representation

        crash_log_contents = file_contents[end_of_ips_header_index + 1:]
        ips_header_object = create_object_from_json(ips_header_contents)
        crash_log_object = create_object_from_json(crash_log_contents)
        if not ips_header_object and not crash_log_object:
            # There may only be one JSON object in the crash file. Trying to parse it as
            # a combination of an IPS header line and a crash payload line resulted in two
            # null JSON object instances. Instead, try parsing it as a single JSON
            # object and determine which one it best represents -- either the IPS header or the crash payload.

            json_object = create_object_from_json(file_contents)
            if self.is_crash_payload_line(json_object):
                crash_log_object = json_object
            elif self.is_ips_header_line(json_object):
                ips_header_object = json_object

        # rdar://83760462
        # Rebuild the fake ips header whenever we're dealing with
        # a crash log whose original ips header got stripped away.
        if crash_log_object and not ips_header_object:
            fake_ips_header = {}
            for osa_metadata_key, osa_crash_payload_key in self.osa_metadata_key_to_crash_payload_key.items():
                fake_ips_value = getattr(crash_log_object, osa_crash_payload_key, None)
                if fake_ips_value:
                    fake_ips_header[osa_metadata_key] = fake_ips_value
                    
            ips_header_object = create_object_from_json(json.dumps(fake_ips_header, default=lambda x : x.__dict__))
            self.reconstructed_fake_ips_header = True
            
        self.ips_header = ips_header_object
        self.crash = crash_log_object

    def thread_backtraces(self):
        return getattr(self.crash, "threads", list())

    def usedImages(self):
        return getattr(self.crash, "usedImages", list())

    def normalize_platform_string(self, platform_string):

        if not platform_string:
            return None
        # The platform string from crash reports will be one of:
        # macOS, WatchOS, iPhoneOS, AppleTVOS, BridgeOS

        # These need to normalized as either:
        # macOS, watchOS, iOS, tvOS, bridgeOS , respectively.
        replacements = {
            "macOS" : "macOS",
            "WatchOS" : "watchOS",
            "iPhoneOS" : "iOS",
            "AppleTVOS" : "tvOS",
            "BridgeOS" : "bridgeOS"
        }

        for key, replacement in replacements.items():
            platform_string = platform_string.replace(key, replacement)

        return platform_string

    def os_version_dictionary(self):
        return getattr(self.crash, "osVersion", None)

    def platform(self):
        # osVersion : {
        #    "train" : "<platformOS> <majorVersion>" ; e.g. "macOS 11.0", "Watch OS 7.0", etc.
        #   "isEmbedded" : <true|false>
        #   "build" : <build number>
        #   "releaseType" : <Internal|External>
        # }
        if not self.crash:
            return None

        os_version = self.os_version_dictionary()
        train = getattr(os_version, "train", None)
        if not train:
            return None

        train_components = train.split()
        # Join all components of the "train" string except for the version number.
        #e.g. "macOS", "WatchOS", "iPhoneOS", "AppleTVOS", "BridgeOS"
        platformOS = ''.join(train_components[:-1])
        return self.normalize_platform_string(platformOS)

    def build_version(self):
        os_version = self.os_version_dictionary()
        return getattr(os_version, "build", None)

    def major_os_version(self):
        os_version = self.os_version_dictionary()
        train = getattr(os_version, "train", None)
        if not train:
            return None
        train_components = train.split()
        return train_components[-1]

    def model_code(self):
        return getattr(self.crash, "modelCode", None)

    def updateLastExceptionBacktrace(self, updated_leb):
        self.crash.lastExceptionBacktrace = updated_leb

    def lastExceptionBacktrace(self):
        # If the crash has a lastExceptionBacktrace, return it.
        # Otherwise, return None
        return getattr(self.crash, "lastExceptionBacktrace", None)
        
    def bug_type(self):
        # Determine the bug_type field, checking both the IPS header and the
        # crash payload in case the IPS header omits the information or the IPS
        # header is stripped altogether.
        ips_header_bug_type = getattr(self.ips_header, self.osa_log_metadata_bug_type_key, None)
        if ips_header_bug_type:
            return str(ips_header_bug_type)
        else:
            payload_bug_type = getattr(self.crash, self.osa_log_crash_payload_bug_type_key, None)
            if payload_bug_type: 
                return str(payload_bug_type)

        return None
            
    def is_valid_json_crash_log_type(self):
        # Valid JSON crash logs are of bug_type 109, 308, 309, 385
        bug_type = self.bug_type()
        return bug_type and bug_type in set(["109", "308", "309", "385"])
            
    def did_reconstruct_ips_header(self):
        return self.reconstructed_fake_ips_header
    
    def ips_header_description(self):
        # Get a string representation of the ips header JSON dictionary.
        if self.ips_header:
            ips_header_dictionary = vars(self.ips_header)
            ips_header_pairs = ['"{}":"{}"'.format(key, value) for key,value in ips_header_dictionary.items()]
            formatted_ips_header = '{' + ",".join(ips_header_pairs) + '}'
            return formatted_ips_header
        else:
            return None
            
    def crash_description(self, **kwargs):
        # Get a string representation of the crash payload
        if self.crash:
            formatted_payload = json.dumps(self.crash, default=lambda x : x.__dict__, **kwargs)
            return formatted_payload
        else:
            return None

    def architectures(self):
        # A set of the unique architectures as indicated by the image list.
        # Some image entries may lack arch fields when not enough information
        # about the image was determined at the time of crash generation.
        # So, make sure to only consider the image's architecture field if it
        # exists.
        image_architectures = [getattr(image, 'arch', None) for image in self.usedImages()]
        return set((image_arch for image_arch in image_architectures if image_arch))

    def write_to(self, output, pretty=False, no_ips_header=False):
    
        if not no_ips_header:
            # First, write the IPS header.
            # The IPS header is all on one line, without any spacing between the list of
            # key-value pairs.
            ips_header_string = self.ips_header_description()
            if ips_header_string:
                output.write("{}\n".format(ips_header_string))

        # Next, the actual crash payload can be written with newlines and any spacing.
        if pretty:
            indent = 2
        else:
            indent = 0
        
        crash_string = self.crash_description(indent=indent)
        if crash_string:
            output.write(crash_string)
