import ctypes
from ctypes import POINTER
import os
import uuid

# Python wrappers around the 'ResultTypes.h' structures found in CoreSymbolication/libatos have
# an "Impl" suffix.  These should be kept in-sync with the struct definitions in ResultTypes.h

# The actual python interface into these structs do not have the "Impl" suffix. 

def _extract_string(char_ptr):
	if char_ptr:
		return str(char_ptr, 'utf-8')
	else:
		return None
'''
struct AddressRange {

	uint64_t location;
	uint64_t length;
};
'''
class AddressRangeImpl(ctypes.Structure):
	_fields_ = [('location', ctypes.c_ulonglong),
				('length', ctypes.c_ulonglong)]

class AddressRange:

	@classmethod
	def _from_address_range_impl(cls, address_range_ptr):
		if not address_range_ptr:
			return None

		location = address_range_ptr.location
		length = address_range_ptr.length
		return cls(location, length)

	def __init__(self, location, length):
		self.location = location
		self.length = length

	def max(self):
		return self.location + self.length

	def __repr__(self):
		return "0x{:08x} - 0x{:08x}".format(self.location, self.max())

'''
struct Segment {

	const char* name;
	AddressRange range;
};
'''

class SegmentImpl(ctypes.Structure):
	_fields_ = [('name', ctypes.c_char_p),
				('range', AddressRangeImpl)]

class Segment:
	@classmethod
	def _from_segment_impl(cls, segment_ptr):
		if not segment_ptr:
			return None

		name = _extract_string(segment_ptr.contents.name)
		if name:
			name = name.replace(' SEGMENT', '')
		address_range = AddressRange._from_address_range_impl(segment_ptr.contents.range)
		return cls(name, address_range)

	def __init__(self, name, address_range):
		self.name = name
		self.address_range = address_range

	def __repr__(self):
		return "{} @ {}".format(self.name, self.address_range)

'''
struct Architecture {

	int cpu_type;
	int cpu_subtype;
};
'''

class ArchitectureImpl(ctypes.Structure):
	_fields_ = [('cpu_type', ctypes.c_int),
				('cpu_subtype', ctypes.c_int)]

class Architecture:

	CPU_ARCH_ABI64 = 0x01000000
	CPU_ARCH_ABI64_32 = 0x02000000

	CPU_TYPE_ANY = -1
	CPU_TYPE_X86 = 7
	CPU_TYPE_I386 = CPU_TYPE_X86
	CPU_TYPE_X86_64 = (CPU_TYPE_X86 | CPU_ARCH_ABI64)
	CPU_TYPE_ARM = 12
	CPU_TYPE_ARM64 = (CPU_TYPE_ARM | CPU_ARCH_ABI64)
	CPU_TYPE_ARM64_32 = (CPU_TYPE_ARM | CPU_ARCH_ABI64_32)

	CPU_SUBTYPE_ANY = -1
	CPU_SUBTYPE_I386_ALL = 3
	CPU_SUBTYPE_X86_ALL = 3
	CPU_SUBTYPE_X86_64_ALL = 3
	CPU_SUBTYPE_X86_64_H = 8

	CPU_SUBTYPE_ARM_ALL = 0
	CPU_SUBTYPE_ARM_V7S = 11
	CPU_SUBTYPE_ARM_V7K = 12
	CPU_SUBTYPE_ARM_V8 = 13

	CPU_SUBTYPE_ARM64_ALL = 0
	CPU_SUBTYPE_ARM64_V8 = 1
	CPU_SUBTYPE_ARM64E = 2

	CPU_SUBTYPE_ARM64_32_ALL = 0
	CPU_SUBTYPE_ARM64_32_V8 = 1

	@classmethod
	def any(cls):
		return cls(Architecture.CPU_TYPE_ANY, Architecture.CPU_SUBTYPE_ANY)

	@classmethod
	def x86_64(cls):
		return cls(Architecture.CPU_TYPE_X86_64, Architecture.CPU_SUBTYPE_I386_ALL)

	@classmethod
	def x86_64h(cls):
		return cls(Architecture.CPU_TYPE_X86_64, Architecture.CPU_SUBTYPE_X86_64_H)

	@classmethod
	def i386(cls):
		return cls(Architecture.CPU_TYPE_I386, Architecture.CPU_SUBTYPE_I386_ALL)

	@classmethod
	def arm64(cls):
		return cls(Architecture.CPU_TYPE_ARM64, Architecture.CPU_SUBTYPE_ARM64_ALL)

	@classmethod
	def arm64_32(cls):
		return cls(Architecture.CPU_TYPE_ARM64_32, Architecture.CPU_SUBTYPE_ARM64_32_ALL)

	@classmethod
	def arm64_32v8(cls):
		return cls(Architecture.CPU_TYPE_ARM64_32, Architecture.CPU_SUBTYPE_ARM_V8)

	@classmethod
	def arm64e(cls):
		return cls(Architecture.CPU_TYPE_ARM64, Architecture.CPU_SUBTYPE_ARM64E)

	@classmethod
	def arm(cls):
		return cls(Architecture.CPU_TYPE_ARM, Architecture.CPU_SUBTYPE_ARM_ALL)

	@classmethod
	def armv7s(cls):
		return cls(Architecture.CPU_TYPE_ARM, Architecture.CPU_SUBTYPE_ARM_V7S)

	@classmethod
	def armv7k(cls):
		return cls(Architecture.CPU_TYPE_ARM, Architecture.CPU_SUBTYPE_ARM_V7K)

	@classmethod
	def armv8(cls):
		return cls(Architecture.CPU_TYPE_ARM64, Architecture.CPU_SUBTYPE_ARM_V8)

	@classmethod
	def _from_architecture_impl(cls, architecture_ptr):
		cpu_type = architecture_ptr.cpu_type
		cpu_subtype = architecture_ptr.cpu_subtype
		return cls(cpu_type, cpu_subtype)

	@classmethod
	def from_architecture_string(cls, architecture_string):
		architecture_mapping = {
			"x86_64"     : Architecture.x86_64(),
			"x86_64h"    : Architecture.x86_64h(),
			"i386"	     : Architecture.i386(),
			"arm64"	     : Architecture.arm64(),
			"arm64_32"   : Architecture.arm64_32(),
			"arm64_32v8" : Architecture.arm64_32v8(),
			"arm64e"     : Architecture.arm64e(),
			"arm"		 : Architecture.arm(),
			"armv7s" 	 : Architecture.armv7s(),
			"armv7k" 	 : Architecture.armv7k(),
			"armv8"		 : Architecture.armv8(),
			"any"		 : Architecture.any()
		}

		if architecture_string in architecture_mapping:
			return architecture_mapping[architecture_string]

		return Architecture.any()

	def __init__(self, cpu_type, cpu_subtype):
		self.cpu_type = cpu_type
		self.cpu_subtype = cpu_subtype

	def _to_architecture_impl(self):
		return ArchitectureImpl(ctypes.c_int(self.cpu_type), ctypes.c_int(self.cpu_subtype))



'''
struct SourceInfo {
	const char* path;
	int line_number;
	int column;
	AddressRange range;
};
'''

class SourceInfoImpl(ctypes.Structure):
	_fields_ = [('path', ctypes.c_char_p),
				('line_number', ctypes.c_int),
				('column', ctypes.c_int),
				('range', AddressRangeImpl)]

class SourceInfo:
	@classmethod
	def _from_source_info_impl(cls, source_info_impl):
		if not source_info_impl:
			return None

		path = source_info_impl.contents.path
		line_number = source_info_impl.contents.line_number
		column = source_info_impl.contents.column
		address_range = AddressRange._from_address_range_impl(source_info_impl.contents.range)
		return cls(path, line_number, column, address_range)

	def __init__(self, path, line_number, column, address_range):
		self.path = path
		self.line_number = line_number
		self.column = column
		self.address_range = range

	def filename(self):
		if self.path:
			return os.path.basename(self.path)
		else:
			return None

	def __repr__(self):
		return "{}:{}".format(self.filename(), self.line_number)


'''
struct Symbol {

	const char* name;
	const char* mangled_name;
	SourceInfo* source_info;
	Symbol* inlined_symbol;
	AddressRange range;
};
'''

class SymbolImpl(ctypes.Structure):
		pass


SymbolImpl._fields_ = [('name', ctypes.c_char_p),
		   ('mangled_name', ctypes.c_char_p),
		   ('flags', ctypes.c_uint),
		   ('source_info', POINTER(SourceInfoImpl)),
		   ('inlined_symbol', POINTER(SymbolImpl)),
		   ('range', AddressRangeImpl)]

class Symbol:

	kCSSymbolIsFunction = 0x1
	kCSSymbolIsDyldStub = 0x2
	kCSSymbolIsObjcMethod = 0x4
	kCSSymbolIsExternal = 0x10
	kCSSymbolIsPrivateExternal = 0x20
	kCSSymbolIsThumb = 0x40
	kCSSymbolIsOmitFramePointer = 0x80
	kCSSymbolIsKnownLength = 0x100
	kCSSymbolIsAlias = 0x200

	def _flag_checker(self, flag):
		return (self.flags & flag) != 0

	@classmethod
	def _from_symbol_impl(cls, symbol_impl):
		if not symbol_impl:
			return None

		name = symbol_impl.contents.name
		mangled_name = symbol_impl.contents.mangled_name
		flags = symbol_impl.contents.flags
		source_info_ptr = symbol_impl.contents.source_info
		if source_info_ptr:
			source_info = SourceInfo._from_source_info_impl(source_info_ptr)
		else:
			source_info = None

		inlined_symbol_ptr = symbol_impl.contents.inlined_symbol
		if inlined_symbol_ptr:
			inlined_symbol = Symbol._from_symbol_impl(inlined_symbol_ptr)
		else:
			inlined_symbol = None

		address_range = AddressRange._from_address_range_impl(symbol_impl.contents.range)

		return cls(name, mangled_name, flags, source_info, inlined_symbol, address_range)

	def __init__(self, name, mangled_name, flags, source_info, inlined_symbol, address_range):
		self.name = name
		self.mangled_name = mangled_name
		self.flags = flags
		self.source_info = source_info
		self.inlined_symbol = inlined_symbol
		self.address_range = address_range

	def is_function(self):
		return self._flag_checker(Symbol.kCSSymbolIsFunction)

	def is_dyld_stub(self):
		return self._flag_checker(Symbol.kCSSymbolIsDyldStub)

	def is_objc_method(self):
		return self._flag_checker(Symbol.kCSSymbolIsObjcMethod)

	def is_external(self):
		return self._flag_checker(Symbol.kCSSymbolIsExternal)

	def is_private_external(self):
		return self._flag_checker(Symbol.kCSSymbolIsPrivateExternal)

	def is_thumb(self):
		return self._flag_checker(Symbol.kCSSymbolIsThumb)

	def is_omit_frame_pointer(self):
		return self._flag_checker(Symbol.kCSSymbolIsOmitFramePointer)

	def is_known_length(self):
		return self._flag_checker(Symbol.kCSSymbolIsKnownLength)

	def is_alias(self):
		return self._flag_checker(Symbol.kCSSymbolIsAlias)

	def __repr__(self):
		return "{} @ {} - {}".format(self.name, self.address_range, self.source_info)

'''
struct SymbolicationResult {

	Symbol** symbols;
	uint32_t symbol_count;

	Segment** segments;
	uint32_t segment_count;


	Architecture architecture;

	const char* dsym_path;
	uint8_t uuid[16];

};
'''

class SymbolicationResultImpl(ctypes.Structure):
	_fields_ = [('symbols', POINTER(POINTER(SymbolImpl))),
				('symbol_count', ctypes.c_uint),
				('segments', POINTER(POINTER(SegmentImpl))),
				('segment_count', ctypes.c_uint),
				('architecture', ArchitectureImpl),
				('dsym_path', ctypes.c_char_p),
				('uuid', ctypes.c_ubyte * 16)]

class SymbolicationResult:


	@classmethod
	def _from_symbolication_result_impl(cls, symbolication_result_impl):

		if not symbolication_result_impl:
			return None

		symbol_impls = symbolication_result_impl.contents.symbols
		symbol_impls_count = symbolication_result_impl.contents.symbol_count
		symbols = [Symbol._from_symbol_impl(symbol_impls[i]) for i in range(symbol_impls_count)]

		segment_impls = symbolication_result_impl.contents.segments
		segment_impls_count = symbolication_result_impl.contents.segment_count
		segments = [Segment._from_segment_impl(segment_impls[i]) for i in range(segment_impls_count)]

		architecture = Architecture._from_architecture_impl(symbolication_result_impl.contents.architecture)

		dsym_path = symbolication_result_impl.contents.dsym_path
		uuid_bytes = bytes(symbolication_result_impl.contents.uuid)
		uuid_buf = uuid.UUID(bytes=uuid_bytes)

		return cls(symbols, segments, architecture, dsym_path, uuid_buf)


	def __init__(self, symbols, segments, architecture, dsym, uuid_buf):
		self.symbols = symbols
		self.symbol_count = len(symbols)
		self.segments = segments
		self.segment_count = len(segments)
		self.architecture = architecture
		self.dsym_path = dsym
		self.uuid = uuid_buf
		


