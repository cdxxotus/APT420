from ctypes import *
from libatos.types import *
import os
import uuid
import sys

if sys.platform == 'darwin':
    _LIBATOS_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), "libs/libatos.dylib")
else:
    _LIBATOS_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), "libatos.framework/libatos")

_libatos = cdll.LoadLibrary(_LIBATOS_PATH)

# Function decorator that wraps all symbolication functions.
# The SymbolicationResult* is used to a construct a python
# SymbolicationResult and the original is destroyed afterwards.
def _extract_symbolication_result(func):
    def extract(*args, **kwargs):
        symbolication_result_impl = func(*args, **kwargs)
        result = SymbolicationResult._from_symbolication_result_impl(symbolication_result_impl)
        _DestroySymbolicationResult(symbolication_result_impl)
        return result
    return extract

# void* CreateSessionWithPathAndArchitecture(const char* path, Architecture arch);
_CreateSessionWithPathAndArchitecture = _libatos.CreateSessionWithPathAndArchitecture
_CreateSessionWithPathAndArchitecture.restype = c_void_p
_CreateSessionWithPathAndArchitecture.argtypes = [c_char_p, ArchitectureImpl]

def CreateSessionWithPathAndArchitecture(path, arch):
    path_ptr = ctypes.c_char_p(path.encode('utf-8'))
    arch_impl = arch._to_architecture_impl()
    return _CreateSessionWithPathAndArchitecture(path_ptr, arch_impl)



# void* CreateSessionWithPathArchitectureAndUUID(const char* path, Architecture arch, uint8_t* uuid);
_CreateSessionWithPathArchitectureAndUUID = _libatos.CreateSessionWithPathArchitectureAndUUID
_CreateSessionWithPathArchitectureAndUUID.restype = c_void_p
_CreateSessionWithPathArchitectureAndUUID.argtypes = [c_char_p, ArchitectureImpl, POINTER(c_ubyte)]

def CreateSessionWithPathArchitectureAndUUID(path, arch, uuid):
    path_ptr = ctypes.c_char_p(path.encode('utf-8'))
    arch_impl = arch._to_architecture_impl()
    uuid_bytes = (ctypes.c_ubyte * 16)(*uuid.bytes)
    return _CreateSessionWithPathArchitectureAndUUID(path_ptr, arch_impl, uuid_bytes)


# void* CreateSessionWithSignaturePath(const char* signature);
_CreateSessionWithSignaturePath = _libatos.CreateSessionWithSignaturePath
_CreateSessionWithSignaturePath.restype = c_void_p
_CreateSessionWithSignaturePath.argtypes = [c_char_p]

def CreateSessionWithSignaturePath(signature_path):
    signature_path_ptr = ctypes.c_char_p(signature_path.encode('utf-8'))
    return _CreateSessionWithSignaturePath(signature_path_ptr)


# void* CreateSessionWithSignatureBytes(const void* signature_bytes, size_t length);
_CreateSessionWithSignatureBytes = _libatos.CreateSessionWithSignatureBytes
_CreateSessionWithSignatureBytes.restype = c_void_p
_CreateSessionWithSignatureBytes.argtypes = [c_void_p, c_size_t]

def CreateSessionWithSignatureBytes(signature_bytes, length):
    signature_bytes_array = ctypes.c_uint8 * length
    signature_bytes_ptr = signature_bytes_array.from_buffer(signature_byte)
    return _CreateSessionWithSignatureBytes(signature_bytes_array, signature_bytes_ptr)



# SymbolicationResult* SymbolicateAddress(void* session, uint64_t address);
_SymbolicateAddress = _libatos.SymbolicateAddress
_SymbolicateAddress.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddress.argtypes = [c_void_p, c_ulonglong]

@_extract_symbolication_result
def SymbolicateAddress(session, address):
    addr_impl = ctypes.c_ulonglong(address)
    return _SymbolicateAddress(session, addr_impl)

# SymbolicationResult* SymbolicateAddressWithSlide(void* session, uint64_t address, uint64_t slide);
_SymbolicateAddressWithSlide = _libatos.SymbolicateAddressWithSlide
_SymbolicateAddressWithSlide.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddressWithSlide.argtypes = [c_void_p, c_ulonglong, c_ulonglong]

@_extract_symbolication_result
def SymbolicateAddressWithSlide(session, address, slide):
    addr_impl = ctypes.c_ulonglong(address)
    slide_impl = ctypes.c_ulonglong(slide)
    return _SymbolicateAddressWithSlide(session, addr_impl, slide_impl)

# SymbolicationResult* SymbolicateAddressWithLoadAddress(void* session, uint64_t address, uint64_t load_address);
_SymbolicateAddressWithLoadAddress = _libatos.SymbolicateAddressWithLoadAddress
_SymbolicateAddressWithLoadAddress.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddressWithLoadAddress.argtypes = [c_void_p, c_ulonglong, c_ulonglong]

@_extract_symbolication_result
def SymbolicateAddressWithLoadAddress(session, address, load_address):
    addr_impl = ctypes.c_ulonglong(address)
    load_addr_impl = ctypes.c_ulonglong(load_address)
    return _SymbolicateAddressWithLoadAddress(session, addr_impl, load_addr_impl)

# SymbolicationResult* SymbolicateAddressWithLoadAddressAndSegment(void* session, uint64_t address, uint64_t load_address, const char* segment_name);
_SymbolicateAddressWithLoadAddressAndSegment = _libatos.SymbolicateAddressWithLoadAddressAndSegment
_SymbolicateAddressWithLoadAddressAndSegment.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddressWithLoadAddressAndSegment.argtypes = [c_void_p, c_ulonglong, c_ulonglong, c_char_p]

@_extract_symbolication_result
def SymbolicateAddressWithLoadAddressAndSegment(session, address, load_address, segment):
    addr_impl = ctypes.c_ulonglong(address)
    load_addr_impl = ctypes.c_ulonglong(load_address)
    segment_impl = ctypes.c_char_p(segment.encode('utf-8'))
    return _SymbolicateAddressWithLoadAddressAndSegment(session, addr_impl, load_addr_impl, segment_impl)

# SymbolicationResult* SymbolicateAddresses(void* session, uint64_t* addresses, uint32_t count);
_SymbolicateAddresses = _libatos.SymbolicateAddresses
_SymbolicateAddresses.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddresses.argtypes = [c_void_p, POINTER(c_ulonglong), c_uint]

@_extract_symbolication_result
def SymbolicateAddresses(session, addresses):
    addresses_impl = (ctypes.c_ulonglong * len(addresses))(*addresses)
    return _SymbolicateAddresses(session, addresses_impl, len(addresses))

# SymbolicationResult* SymbolicateAddressesWithSlide(void* session, uint64_t* addresses, uint32_t count, uint64_t slide);
_SymbolicateAddressesWithSlide = _libatos.SymbolicateAddressesWithSlide
_SymbolicateAddressesWithSlide.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddressesWithSlide.argtypes = [c_void_p, POINTER(c_ulonglong), c_uint, c_ulonglong]

@_extract_symbolication_result
def SymbolicateAddressesWithSlide(session, addresses, slide):
    addresses_impl = (ctypes.c_ulonglong * len(addresses))(*addresses)
    slide_impl = ctypes.c_ulonglong(slide)
    return _SymbolicateAddressesWithSlide(session, addresses_impl, len(addresses), slide_impl)

# SymbolicationResult* SymbolicateAddressesWithLoadAddress(void* session, uint64_t* addresses, uint32_t count, uint64_t load_address);
_SymbolicateAddressesWithLoadAddress = _libatos.SymbolicateAddressesWithLoadAddress
_SymbolicateAddressesWithLoadAddress.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddressesWithLoadAddress.argtypes = [c_void_p, POINTER(c_ulonglong), c_uint, c_ulonglong]

@_extract_symbolication_result
def SymbolicateAddressesWithLoadAddress(session, addresses, load_address):
    addresses_impl = (ctypes.c_ulonglong * len(addresses))(*addresses)
    load_addr_impl = ctypes.c_ulonglong(load_address)
    return _SymbolicateAddressesWithLoadAddress(session, addresses_impl, len(addresses), load_addr_impl)

# SymbolicationResult* SymbolicateAddressesWithLoadAddressAndSegment(void* session, uint64_t* addresses, uint32_t count, uint64_t load_address, const char* segment_name);
_SymbolicateAddressesWithLoadAddressAndSegment = _libatos.SymbolicateAddressesWithLoadAddressAndSegment
_SymbolicateAddressesWithLoadAddressAndSegment.restype = POINTER(SymbolicationResultImpl)
_SymbolicateAddressesWithLoadAddressAndSegment.argtypes = [c_void_p, POINTER(c_ulonglong), c_uint, c_ulonglong, c_char_p]

@_extract_symbolication_result
def SymbolicateAddressesWithLoadAddressAndSegment(session, addresses, load_address, segment):
    addresses_impl = (ctypes.c_ulonglong * len(addresses))(*addresses)
    load_addr_impl = ctypes.c_ulonglong(load_address)
    segment_impl = ctypes.c_char_p(segment.encode('utf-8'))
    return _SymbolicateAddressesWithLoadAddressAndSegment(session, addresses_impl, len(addresses), load_addr_impl, segment_impl)


_SymbolicateOffsetsRelativeToBase = _libatos.SymbolicateOffsetsRelativeToBase
_SymbolicateOffsetsRelativeToBase.restype = POINTER(SymbolicationResultImpl)
_SymbolicateOffsetsRelativeToBase.argtypes = [c_void_p, POINTER(c_ulonglong), c_uint, c_ulonglong]

@_extract_symbolication_result
def SymbolicateOffsetsRelativeToBase(session, offsets, base):
    offsets_impl = (ctypes.c_ulonglong * len(offsets))(*offsets)
    base_impl = ctypes.c_ulonglong(base)
    return _SymbolicateOffsetsRelativeToBase(session, offsets_impl, len(offsets), base_impl)

_SymbolicateOffsetsRelativeToSegment = _libatos.SymbolicateOffsetsRelativeToSegment
_SymbolicateOffsetsRelativeToSegment.restype = POINTER(SymbolicationResultImpl)
_SymbolicateOffsetsRelativeToSegment.argtypes = [c_void_p, POINTER(c_ulonglong), c_uint, c_char_p]

@_extract_symbolication_result
def SymbolicateOffsetsRelativeToSegment(session, offsets, segment):
    offsets_impl = (ctypes.c_ulonglong * len(offsets))(*offsets)
    segment_impl = ctypes.c_char_p(segment.encode('utf-8'))
    return _SymbolicateOffsetsRelativeToSegment(session, offsets_impl, len(offsets), segment_impl)


_SymbolicateOffsetRelativeToBase = _libatos.SymbolicateOffsetRelativeToBase
_SymbolicateOffsetRelativeToBase.restype = POINTER(SymbolicationResultImpl)
_SymbolicateOffsetRelativeToBase.argtypes = [c_void_p, c_ulonglong, c_ulonglong]

@_extract_symbolication_result
def SymbolicateOffsetRelativeToBase(session, offset, base):
    offset_impl = ctypes.c_ulonglong(offset)
    base_impl = ctypes.c_ulonglong(base)
    return _SymbolicateOffsetRelativeToBase(session, offset_impl, base_impl)

_SymbolicateOffsetRelativeToSegment = _libatos.SymbolicateOffsetRelativeToSegment
_SymbolicateOffsetRelativeToSegment.restype = POINTER(SymbolicationResultImpl)
_SymbolicateOffsetRelativeToSegment.argtypes = [c_void_p, c_ulonglong, c_char_p]

@_extract_symbolication_result
def SymbolicateOffsetRelativeToSegment(session, offset, segment):
    offset_impl = ctypes.c_ulonglong(offset)
    segment_impl = ctypes.c_char_p(segment.encode('utf-8'))
    return _SymbolicateOffsetRelativeToSegment(session, offset_impl, segment_impl)


_Segments = _libatos.Segments
_Segments.restype = POINTER(SymbolicationResultImpl)
_Segments.argtypes = [c_void_p]
@_extract_symbolication_result
def Segments(session):
    return _Segments(session)


_SegmentWithAddress = _libatos.SegmentWithAddress
_SegmentWithAddress.restype =  POINTER(SymbolicationResultImpl)
_SegmentWithAddress.argtypes = [c_void_p, c_ulonglong]
@_extract_symbolication_result
def SegmentWithAddress(session, address):
    addr_impl = ctypes.c_ulonglong(address)
    return _SegmentWithAddress(session, addr_impl)



# void DestroySymbolicationResult(SymbolicationResult* result);
_DestroySymbolicationResult = _libatos.DestroySymbolicationResult
_DestroySymbolicationResult.restype = None
_DestroySymbolicationResult.argtypes = [POINTER(SymbolicationResultImpl)]

# void DestroySymbolicationSession(void* session);
DestroySymbolicationSession = _libatos.DestroySymbolicationSession
DestroySymbolicationSession.restype = None
DestroySymbolicationSession.argtypes = [c_void_p]

#bool AddDsymSearchPath(void* session, const char* path);
_AddDsymSearchPath = _libatos.AddDsymSearchPath
_AddDsymSearchPath.restype = c_bool
_AddDsymSearchPath.argtypes = [c_void_p, c_char_p]
def AddDsymSearchPaths(session, paths):
    success = True
    for path in paths:
        path_impl = ctypes.c_char_p(path.encode('utf-8'))
        success = success and _AddDsymSearchPath(session, path_impl)
    return success