import pathlib

class DeviceSupportDirectories(object):
	
	Universal = "universal"
	ModelSpecific = "model"
	Architectures = "arch"
	Fallback = "Fallback"

	def is_usable_device_support_directory(self, device_support_dir):
		# A potential device support directory is validated by 
		# checking that it actually exists on the filesystem and
		# also has the '.finalized' file. The presence of this file
		# indicates that all of the necessary symbols have been
		# copied over from the device.
		if not device_support_dir:
			return False

		if not device_support_dir.exists():
			return False
		if not device_support_dir.is_dir():
			return False

		finalized_file = device_support_dir.parent / ".finalized"
		return finalized_file.exists()	

	def usable_device_support_directory(self, directory):
		if self.is_usable_device_support_directory(directory):
			return directory
		return None

	def usable_device_support_directories(self, directories):
		# Return a filtered list of directories that are usable for
		# discovering symbol rich binaries.
		if not directories:
			return []
		return [directory for directory in directories if self.is_usable_device_support_directory(directory)]

	def library_xcode_path(self):
		home_directory = pathlib.Path.home()
		xcode_directory = home_directory / "Library/Developer/Xcode"
		return xcode_directory

	def device_support_directory(self):
		if not self.device_support_dir:
			xcode_directory = self.library_xcode_path()
			device_support_dir = xcode_directory / "{} DeviceSupport/".format(self.platform)
			self.device_support_dir =  device_support_dir

		# ~/Library/Developer/Xcode/<foo>OS DeviceSupport/
		return self.device_support_dir

	def universal_symbols_path(self):
		if not self.os_version or not self.build:
			return None

		# <Device Support Dir>/8.0 (19R270) universal/Symbols
		device_support = self.device_support_directory()
		universal_subdirectory = "{} ({}) universal/".format(self.os_version, self.build)
		universal_symbol_dir = device_support / universal_subdirectory / "Symbols"
		return universal_symbol_dir

	def model_specific_symbols_path(self):
		if not self.model_code or not self.os_version or not self.build:
			return None

		# <Device Support Dir>/Watch4,1 8.0 (19R270)/Symbols
		device_support = self.device_support_directory()
		model_specific_subdirectory = "{} {} ({})".format(self.model_code, self.os_version, self.build)
		model_specific_dir = device_support / model_specific_subdirectory / "Symbols"
		return model_specific_dir


	def arch_specific_symbols_paths(self):
		if not self.os_version or not self.build or not self.architectures:
			return None

		# <Device Support Dir>/8.0 (19R270) arm64/Symbols
		# <Device Support Dir>/8.0 (19R270) arm64e/Symbols

		device_support = self.device_support_directory()
		arch_subdirectories = ["{} ({}) {}".format(self.os_version, self.build, arch) for arch in self.architectures]
		arch_dirs = [device_support / arch_subdirectory / "Symbols" for arch_subdirectory in arch_subdirectories]
		return arch_dirs

	def fallback_symbols_path(self):
		if not self.os_version or not self.build:
			return None

		# <Device Support Dir>/8.0 (19R270)/Symbols
		device_support = self.device_support_directory()
		fallback_subdirectory = "{} ({})".format(self.os_version, self.build)
		fallback_dir = device_support / fallback_subdirectory / "Symbols"
		return fallback_dir

	def directories(self):
		# Prefer univesal, then model specific, then arch-specific, then the fallback
		preferred_order_keys = [self.Universal, self.ModelSpecific, self.Architectures, self.Fallback]
		preferred_directories = [self.symbols_directories[key] for key in preferred_order_keys]
		result = []
		for directory in preferred_directories:
			if not directory:
				continue

			if isinstance(directory, list):
				# We can have multiple architectures, which are expressed with a list
				result.extend(directory)
			else:
				result.append(directory)
		return result

	def __init__(self, platform, os_version, build, model_code, architectures):
		self.platform = platform
		self.os_version = os_version
		self.model_code = model_code
		self.architectures = architectures
		self.build = build
		self.device_support_dir = None

		# Generate a list of candidate directories for each category
		universal_symbols = self.universal_symbols_path()
		model_specific_symbols = self.model_specific_symbols_path()
		arch_specific_symbols = self.arch_specific_symbols_paths()
		fallback_symbols = self.fallback_symbols_path()

		# Define a dictionary of Category -> Directories where the Directories
		# are filtered down from the candidate directories. Only those directories
		# that are actually usable are kept.
		self.symbols_directories = {
			self.Universal : self.usable_device_support_directory(universal_symbols),
			self.ModelSpecific : self.usable_device_support_directory(model_specific_symbols),
			self.Architectures : self.usable_device_support_directories(arch_specific_symbols),
			self.Fallback : self.usable_device_support_directory(fallback_symbols)
		}

	# Helper method to instantiate a JSONCrashLog
	@classmethod
	def FromCrashLog(cls, crash):
		platform = crash.platform()
		os_version = crash.major_os_version()
		build = crash.build_version()
		model_code = crash.model_code()
		architectures = crash.architectures()

		return cls(platform, os_version, build, model_code, architectures)


def device_support_directories_for_crash(crash):
	device_support_directories = DeviceSupportDirectories.FromCrashLog(crash)
	return device_support_directories.directories()
