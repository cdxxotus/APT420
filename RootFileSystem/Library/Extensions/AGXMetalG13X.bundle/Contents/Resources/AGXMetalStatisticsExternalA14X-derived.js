// input: num_cores - the number of FSTP cores.;
// input: num_gps - the number of GTP GPs.;
// we default initialize the inputs so that generate_derived_ctr_plists.py does not deduce that they are counters
var num_cores = 8;
var num_gps = 4;
var _d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a = 768;
var _55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 = 32;
var num_mgpus = 1;
var TileWidth = 0;
var TileHeight = 0;
var _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6 = (1000.0 / 24.0);

// name: GPU Time
// description: GPU Time in nSec
// type: Count
function GPUTime()
{
    return MTLStat_nSec;
}

// name: Vertex Pipeline %
// description: % of vertex processing
// type: Percentage
function VertexPipelinePercent()
{
    return (MTLStatTotalGPUCycles_vtx * 100) / (MTLStatTotalGPUCycles_frg + MTLStatTotalGPUCycles_vtx);    
}

// name: Fragment Pipeline %
// description: % of fragment processing
// type: Percentage
function FragmentPipelinePercent()
{
    return (MTLStatTotalGPUCycles_frg * 100) / (MTLStatTotalGPUCycles_frg + MTLStatTotalGPUCycles_vtx);
}

// name: Shader Core Vertex Utilization %
// description: % Shader Core Vertex Utilization
// type: Percentage
function ShaderCoreVertexUtilization()
{
    return _4bb4a72bfa974f38e0143eef87e93ae69847e8612684f014350fb4a8c0692050_norm_vtx / (_d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a * num_cores);
}

// name: Shader Core Fragment Utilization %
// description: % Shader Core Fragment Utilization
// type: Percentage
function ShaderCoreFragmentUtilization()
{
    return _367a60a3f4d39b45114c57a560ad1bad4f9f62798346ead3a98f790ad32537a6_norm_frg / (_d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a * num_cores);
}

// name: Shader Core Compute Utilization %
// description: % Shader Core Compute Utilization
// type: Percentage
function ShaderCoreComputeUtilization()
{
    return _6b3a9b25a65b692ad1039bcc4c052d5a85e40a9410946c0cdf5dc85d993e2131_norm / (_d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a * num_cores);
}

// name: VS ALU Instructions
// description: VS ALU Instructions
// type: Count
function VSALUInstructions()
{ 
    return _55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_vtx * 8;
}

// name: VS ALU FP32 Instructions %
// description: VS ALU FP32 Instructions
// type: Percentage
function VSALUF32Percent()
{
    return 100 * (_8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a_vtx * 16) / VSALUInstructions();
}

// name: VS ALU FP16 Instructions %
// description: VS ALU FP16 Instructions
// type: Percentage
function VSALUF16Percent()
{
    return 100 * (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d_vtx * 16) / VSALUInstructions();
}

// name: VS ALU 32-bit Integer and Conditional Instructions %
// description: VS ALU Select, Conditional, 32-bit Integer and Boolean Instructions
// type: Percentage
function VSALUInt32AndCondPercent()
{
    return 100 * (_23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03_vtx * 16) / VSALUInstructions();
}

// name: VS ALU Integer and Complex Instructions %
// description: VS ALU Integer and Complex Instructions
// type: Percentage
function VSALUIntAndComplexPercent()
{
    return 100 * (_827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb_vtx * 16) / VSALUInstructions();
}

// name: FS ALU Instructions
// description: FS ALU Instructions
// type: Count
function FSALUInstructions()
{
    return _55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_frg * 8;
}

// name: FS ALU FP32 Instructions %
// description: FS ALU FP32 Instructions
// type: Percentage
function FSALUF32Percent()
{
    return 100 * (_8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a_frg * 16) / FSALUInstructions();
}

// name: FS ALU FP16 Instructions %
// description: FS ALU FP16 Instructions
// type: Percentage
function FSALUF16Percent()
{
    return 100 * (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d_frg * 16) / FSALUInstructions();
}

// name: FS ALU 32-bit Integer and Conditional Instructions %
// description: FS ALU Select, Conditional, 32-bit Integer and Boolean Instructions
// type: Percentage
function FSALUInt32AndCondPercent()
{
    return 100 * (_23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03_frg * 16) / FSALUInstructions();
}

// name: FS ALU Integer and Complex Instructions %
// description: FS ALU Integer and Complex Instructions
// type: Percentage
function FSALUIntAndComplexPercent()
{
    return 100 * (_827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb_frg * 16) / FSALUInstructions();
}

// name: CS ALU Instructions
// description: CS ALU Instructions
// type: Count
function CSALUInstructions()
{
    return _55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_cmp * 8;
}

// name: CS ALU FP32 Instructions %
// description: CS ALU FP32 Instructions
// type: Percentage
function CSALUF32Percent()
{
    return 100 * (_8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a_cmp * 16) / CSALUInstructions();
}

// name: CS ALU FP16 Instructions %
// description: CS ALU FP16 Instructions
// type: Percentage
function CSALUF16Percent()
{
    return 100 * (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d_cmp * 16) / CSALUInstructions();
}

// name: CS ALU 32-bit Integer and Conditional Instructions %
// description: CS ALU Select, Conditional, 32-bit Integer and Boolean Instructions
// type: Percentage
function CSALUInt32AndCondPercent()
{
    return 100 * (_23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03_cmp * 16) / CSALUInstructions();
}

// name: CS ALU Integer and Complex Instructions %
// description: CS ALU Integer and Complex Instructions
// type: Percentage
function CSALUIntAndComplexPercent()
{
    return 100 * (_827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb_cmp * 16) / CSALUInstructions();
}

// name: VS Invocations
// description: Number of times vertex shader is invoked
// type: Count
function VSInvocation()
{
    return _da2d5f5fd43e7edda6d5635752a29f09d285cf47c2ecd0a1b83b1ba3eddcef55_vtx;
}

// name: FS Invocations
// description: Number of times fragment shader is invoked
// type: Count
function PSInvocation()
{
    return _448897b2730c90c177c3e468d3780d048b4ef0c6feb09887550eb9e5e71373c0 * 32;
}

// name: CS Invocations
// description: Number of times compute shader is invoked
// type: Count
function CSInvocation()
{
    return _e319ade855d6fde34a28ecc2a2266f86d6d99b5e413e08b4884629844476c571 + _83b4492da25346ffc6c1820a633ef533874dda8e2939056928ffd92384775e38 + _a3104b8f0a1ab0931761cf851c8ac5ce3212eff30deff24a1f9a5ef67453adca + _bd9f890bd3bdbe08af5851fb3dfa228a36a5e54b72c7d74d5985af75bafa6217;
}

// name: Vertex Rate
// description: Number of vertices processed per nanosecond
// type: Rate
function VerticesPerNSec()
{
    return VSInvocation() / (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e_vtx * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6);
}

// name: Primitive Rate
// description: Number of primitives processed per nanosecond
// type: Rate
function PrimitivesPerNSec()
{
    return PrimitivesSubmitted() / (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e_vtx * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6);
}

// name: Pixel Rate
// description: Number of fragments processed per nanosecond
// type: Rate
function PixelsPerNSec()
{
    return PSInvocation() / (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e_frg * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6);
}

// name: Pixel To Vertex Ratio
// description: Number of pixels per vertex
// type: Rate
function PixelToVertexRatio()
{
    return PSInvocation() / VSInvocation();
}

// name: Pixel Per Triangle
// description: Number of pixels per triangle
// type: Rate
function PixelPerTriangle()
{
    return PSInvocation() / PrimitivesSubmitted();
}

// name: Draw Calls
// description: Number of draw calls
// type: Count
function DrawCalls()
{
    return _f6c3f9b835930ff834f081ab2dfaacbdfbe451f6f2100abcdecec1c3c7999e0b_vtx / num_gps;
}

// name: Vertex Count
// description: Number of vertices being submitted to input assembly
// type: Count
function VerticesSubmitted()
{
    return _427543bc9ae51e5f3520629f8bbe54e3a18d14de616f0c418cf7190a55cd7d9c_vtx;
}

// name: Vertices Reused
// description: Number of vertices being reused
// type: Count
function VerticesReused()
{
    return VerticesSubmitted() - VSInvocation();
}

// name: Vertices Reused %
// description: % of vertices being reused
// type: Percentage
function VerticesReusedPercent()
{
    return (VerticesSubmitted() - VSInvocation()) * 100 / VerticesSubmitted();
}

// name: Primitives Submitted
// description: Number of primitives gathered by input assembly
// type: Count
function PrimitivesSubmitted()
{
    return _0c33d520d54b5d5f84a71398d6ae71152426874088128bd3c18ad78df5f6d8b7_vtx;
}

// name: Primitives Rasterized
// description: Number of primitives rasterized
// type: Count
function PrimitivesRasterized()
{
    return _2d3c257f33af88b8488658fb5b6a86f64cb02169b680e1250d3f37d373a4197f_vtx;
}

// name: Primitives Rendered %
// description: % of primitives rasterized
// type: Percentage
function PrimitivesRasterizedPercent()
{
    return PrimitivesRasterized() * 100 / Math.max(InputPrimitivesPostClipping(), 1.0);;
}

// name: Primitives Clipped
// description: Number of primitives being clipped
// type: Count
function ClippedPrimitives()
{
    return _29091329a1ff8f86d51ab9b84da709de18ba8aa1d94003a519a0663db7add4a1_vtx + _6169af48fcc4f2c5d036243de6acd153bd0308c644bd7e4afc67499ad1aef2c7_vtx;
}

// name: Primitives Clipped %
// description: % of primitives clipped
// type: Percentage
function ClippedPrimitivesPercent()
{
    return ClippedPrimitives() * 100 / PreCullPrimitiveCount();
}

// name: Back-Facing Cull Primitives
// description: Number of primitives being culled due to being back-facing
// type: Count
function BackFaceCullPrims()
{
    return _b466c606c4b7e98fcde3adad24a292c946f1f1130670918262ebf9f660e0173c_vtx;
}


// name: Back-Facing Clipped Primitives
// description: Number of primitives being culled due to being back-facing
// type: Count
function BackFaceClippedPrims()
{
    return _9f4066c82340989d0ea535230ddae2a44d311837c37d0eb67d122b2c592e661f_vtx;
}

// name: Small Triangle Clipped Primitives
// description: Number of primitives being clipped due to having small triangles
// type: Count
function SmallTriangleClippedPrims()
{
    return _01038280d9d6c505432733b12946359b7c301c69b32369f4b921b6fa206c2211_vtx;
}

// name: Triangles Created By Clipper
// description: Triangles created by clipper
// type: Count
function TrianglesCreatedByClipper()
{
    return _1b4a415305c5e09fd037b34e5c34c099f08044e780d5c06d813ce80cf354dafd_vtx;
}

// name: Vertices Created By Clipper
// description: Vertices created by clipper
// type: Count
function VerticesCreatedByClipper()
{
    return _d1bc81f56d6b804a852adb705f1ef63549265bdfc317d5a3af98aaee0d8f8ef9_vtx;
}

// name: Input Primitives Post Clipping
// description: Number of post clipped primitives
// type: Count
function InputPrimitivesPostClipping()
{
    return Math.max(PreCullPrimitiveCount() - ClippedPrimitives(), 0.0) + TrianglesCreatedByClipper();
}

// name: Small Triangle Cull Primitives
// description: Number of primitives being culled due to having small triangles
// type: Count
function SmallTriangleCullPrims()
{    
    return Math.max(CulledPrimitives() - GuardBandCullPrims() - BackFaceCullPrims() - OffscreenCullPrims() - SmallTriangleClippedPrims() -  BackFaceClippedPrims(), 0.0);
}

// name: Back-Facing Cull Primitives %
// description: % of primitives being culled due to being back-facing
// type: Percentage
function BackFaceCullPrimsPercent()
{
    return BackFaceCullPrims() * 100 / Math.max(InputPrimitivesPostClipping(), 1.0);
}

// name: Small Triangle Cull Primitives %
// description: % of primitives being culled due small area triangles
// type: Percentage
function SmallTriangleCullPrimsPercent()
{
    return SmallTriangleCullPrims() * 100 / Math.max(InputPrimitivesPostClipping(), 1.0);
}

// name: Guard Band Cull Primitives
// description: Number of primitives being culled due to being outside guard band
// type: Count
function GuardBandCullPrims()
{
    return _4b1f5c87264cd5cd23bb5eb652d21194fb7f49f9b1d70433f180b31a7a22dcab_vtx + _4bb4ab3f3e64c565175f4fbe0f75df41b12c3bc2b4242b99cd4a330773d475d4_vtx + _d7b92925765e8d20627989863f1b950ec5d6dffbd815c4c100730b3a7e7801fd_vtx;
}

// name: Guard Band Cull Primitives %
// description: % of primitives being culled due to being outside guard band
// type: Percentage
function GuardBandCullPrimsPercent()
{
    return GuardBandCullPrims() * 100 / Math.max(InputPrimitivesPostClipping(), 1.0);
}

// name: Off-screen Cull Primitives
// description: Number of primitives being culled due to being off-screen
// type: Count
function OffscreenCullPrims()
{
    return _0f9aab25f0863ace3de6f9832139250c806045a7ac0d6f8cf06c682c282005f1_vtx + _dbe3d527893309548e6eebdee711a622433c869e148727cf18e31ae63cf116d3_vtx + _3bd7a95222e8315bf62e84ba01a511e64bd7aa7487bed322a8ac96e4c4e628e1_vtx;
}

// name: Off-screen Cull Primitives %
// description: % of primitives being culled due to being off-screen
// type: Percentage
function OffscreenCullPrimsPercent()
{
    return OffscreenCullPrims() * 100.0 / Math.max(InputPrimitivesPostClipping(), 1.0);
}

// name: Culled Primitives
// description: Number of total culled primitives
// type: Count
function CulledPrimitives()
{
    return Math.max(InputPrimitivesPostClipping() - PrimitivesRasterized(), 0.0);
}

// name: Culled Primitives %
// description: % of Culled Primitives
// type: Percentage
function CulledPrimitivesPercent()
{
    return CulledPrimitives() * 100.0 / Math.max(InputPrimitivesPostClipping(), 1.0);
}

// name: Fragments Rasterized
// description: Number of fragments rasterized
// type: Count
function FragmentsRasterized()
{
    return (_7cef4e481233623472ea3e1f6b4131fabb20f247f7e5eae173dfd693aa60d0ff - _9177fce9b3d9e2a64a816854b3084588e4673c25a1c069c53b5909a77fb853eb) * 32 + _9177fce9b3d9e2a64a816854b3084588e4673c25a1c069c53b5909a77fb853eb * TileWidth * TileHeight;
}

// name: Pre Z Pass Count
// description: Pre Z Pass Count
// type: Count
function PreZPassCount()
{
    return (_24be79c8d8f70844505a88372d5027b6f8afd064ccbab97ac3ffe36dd5a0ef2b - _9177fce9b3d9e2a64a816854b3084588e4673c25a1c069c53b5909a77fb853eb) * 32 + _9177fce9b3d9e2a64a816854b3084588e4673c25a1c069c53b5909a77fb853eb * TileWidth * TileHeight;
}

// name: Pre Z Fail Count
// description: Pre Z Fail Count
// type: Count
function PreZFailCount()
{
    return Math.max(FragmentsRasterized() - PreZPassCount(), 0.0);
}

// name: Pre Z Fail %
// description: % Pre Z Fail
// type: Percentage
function PreZFailCountPercent()
{
    return PreZFailCount() * 100 / FragmentsRasterized();
}

// name: Pre Z Pass %
// description: % Pre Z Pass
// type: Percentage
function PreZPassCountPercent()
{
    return (PreZPassCount() * 100) / FragmentsRasterized();
}

// name: Pixels Per Tile
// description: Pixels per tile
// type: Count
function PixelsPerTile()
{
    return TileWidth * TileHeight;
}

// name: Average Overdraw
// description: Pixel Overdraw
// type: Count
function AverageOverdraw()
{
    if (TileWidth * TileHeight > 0)
    {
        return PSInvocation() / (_eda5bce70befa39e7c6029505c0269211092c220048a502fd8fa2fe30895465b * TileWidth * TileHeight);
    }
    return 0;
}

// name: VS Texture Cache Miss Rate
// description: Percentage of time L1 Texture Cache access is a Miss
// type: Percentage
function VSTextureCacheMissRate()
{
    return _867226b78b975653eb9f9d171ce53bedbf3edbc1ee1af8aa960cb9db4ec6490f_vtx * 100 / _df20e560276a18cd9b97f03f47abf0d8bf719014920913d325c6ad5d4ab98453_vtx;
}

// name: FS Texture Cache Miss Rate
// description: Percentage of time L1 Texture Cache access is a Miss
// type: Percentage
function FSTextureCacheMissRate()
{
    // Not in limiter
    // * need replacement for TPU_TL1C_TOP_GM_REQUEST
    return _867226b78b975653eb9f9d171ce53bedbf3edbc1ee1af8aa960cb9db4ec6490f_frg * 100 / _df20e560276a18cd9b97f03f47abf0d8bf719014920913d325c6ad5d4ab98453_frg;
}

// name: VS USC L1 Cache Hits
// description: VS L1 Request Hits
// type: Count
function VSBufferL1RequestHits()
{
  return _0b21821861563cc7963f603f7e5e23c70e5a880cfde9c726a3058746854ff882_vtx + _1d940c54d6f56bab841c80e54d16161b2b11c5cc2818b10a3b8e97cd88631cb8_vtx;
}

// name: VS USC L1 Cache Miss Rate
// description: Percentage of time VS USC L1 Requests are misses
// type: Percentage
function VSBufferL1RequestMissRate()
{
  var uscL1Requests = _8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_vtx + _3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_vtx;
  return 100.0 * Math.max(uscL1Requests - VSBufferL1RequestHits(), 0.0) / Math.max(uscL1Requests, 1.0);
}

// name: FS USC L1 Cache Hits
// description: FS L1 Request Hits
// type: Count
function FSBufferL1RequestHits()
{
  return _0b21821861563cc7963f603f7e5e23c70e5a880cfde9c726a3058746854ff882_frg + _1d940c54d6f56bab841c80e54d16161b2b11c5cc2818b10a3b8e97cd88631cb8_frg;
}

// name: FS USC L1 Cache Miss Rate
// description: Percentage of time VS USC L1 Requests are misses
// type: Percentage
function FSBufferL1RequestMissRate()
{
  var uscL1Requests = _8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_frg + _3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_frg;
  return 100.0 * Math.max(uscL1Requests - FSBufferL1RequestHits(), 0.0) / Math.max(uscL1Requests, 1.0);
}

// name: USC L1 Cache Hits
// description: L1 Request Hits
// type: Count
function BufferL1RequestHits()
{
  return _0b21821861563cc7963f603f7e5e23c70e5a880cfde9c726a3058746854ff882 + _1d940c54d6f56bab841c80e54d16161b2b11c5cc2818b10a3b8e97cd88631cb8;
}

// name: USC L1 Cache Miss Rate
// description: Percentage of time USC L1 Requests are misses
// type: Percentage
function BufferL1RequestMissRate()
{
  var uscL1Requests = _8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015 + _3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5;
  return 100.0 * Math.max(uscL1Requests - BufferL1RequestHits(), 0.0) / Math.max(uscL1Requests, 1.0);
}

// name: VS Texture samples
// description: VS Texture samples
// type: Count
function VSTextureSamples()
{
    return Math.max((_ae304fc8bce5708ffef30935687e442d6bea78f814055a5fe6e3380013d7e507_vtx * 64) - (_f46268d72ed52af703d1b490e193d71605d5c756930dfe9385a5433c9b4f264f_vtx * 4), 0);
}

// name: FS Texture samples
// description: FS Texture samples
// type: Count
function FSTextureSamples()
{
   return Math.max((_ae304fc8bce5708ffef30935687e442d6bea78f814055a5fe6e3380013d7e507_frg * 64) - (_f46268d72ed52af703d1b490e193d71605d5c756930dfe9385a5433c9b4f264f_frg * 4), 0);
}

// name: CS Texture samples
// description: CS Texture samples
// type: Count
function CSTextureSamples()
{
   return Math.max((_ae304fc8bce5708ffef30935687e442d6bea78f814055a5fe6e3380013d7e507_cmp * 64) - (_f46268d72ed52af703d1b490e193d71605d5c756930dfe9385a5433c9b4f264f_cmp * 4), 0);
}

// name: Texture samples per invocation
// description: VS Texture samples per invocation
// type: Rate
function VSTextureSamplesPerInvocation()
{
    return VSTextureSamples() / VSInvocation()
}

// name: Texture samples per invocation
// description: FS Texture samples per invocation
// type: Rate
function FSTextureSamplesPerInvocation()
{
    return FSTextureSamples() / PSInvocation()
}

// name: Texture samples per invocation
// description: CS Texture samples per invocation
// type: Rate
function CSTextureSamplesPerInvocation()
{
    return CSTextureSamples() / CSInvocation()
}

// name: Average Anisotropic Ratio
// description: Average Anisotropic Ratio
// type: Rate
function AverageAnisotropicRatio()
{
    var total = _a7e72038471917bb4125254ae57103538d43fd9d4a233b06a1f248ca3bfc11ac +
                2 * _f76e110e78dbd810843354c733691fcfcd8a5624a46d34e887797178f903ab95 +
                3 * _ce8d2278e7b086459bd4cccfe0b5c79b13ff287bf60e12cb62113d7478856b46 +
                4 * _88a70ef450a839c73c44e1ebf268aa13bf92a5179d6ff3ab45ac0006fa8544cd +
                6 * _851e2825825612ac09e7b26350dc1b5b05998c3aab3198f4a2921768a84dfbbb +
                8 * _b48ed13a188e430f6a5bd26a74642ceabd518b8d290fe8322ebc00a7671bef9d +
                10 * _3b22188697e2c64b322decfb2df85c2cd7a7f264312a00737b10231811737d35 +
                12 * _14a170fde3d2efeda34d72f062b69852d6b927feb012e65ae602e9c41c3565ba +
                14 * _57bf025a3b6e220efeee5fb9ecd97ad51c6adcccb96ca62426cc096e38eb9aa0 +
                16 * _d86114b5bc1b6abf8638dd305669a55d8b394e5709b8e33e585d73c184d18943;
        
    return Math.round(total / _838e506beb7a1376c2242cd5738a6016661bdfccb78c105f3ce081c89735bc9d);
}

// name: Total Texture Accesses
// description: Total Number of texture accesses read, sample, gather
// type: Count
function TextureAccesses()
{
    return _ae304fc8bce5708ffef30935687e442d6bea78f814055a5fe6e3380013d7e507 * 64;
}

// name: Total Texture Quads
// description: Total Number of texture quads
// type: Count
function TextureQuads()
{
    return _0927651557827fd5468721c2ee04ff7924ebb553f9e0acc6b504a791aefdf935 * 64;
}

// name: Total Texture Quads Gathered
// description: Total Number of texture quads gathered
// type: Count
function TextureQuadsGathered()
{
    return _f46268d72ed52af703d1b490e193d71605d5c756930dfe9385a5433c9b4f264f * 4;
}

// name: Total Texture Samples
// description: Total Number of texture samples
// type: Count
function TextureSamples()
{
    return Math.max((_ae304fc8bce5708ffef30935687e442d6bea78f814055a5fe6e3380013d7e507 * 64) - (_f46268d72ed52af703d1b490e193d71605d5c756930dfe9385a5433c9b4f264f * 4), 0);
}

// name: Anisotropic Samples
// description: Number of texture samples with anisotropic filtering
// type: Count
function AnisotropicSamples()
{
    return _838e506beb7a1376c2242cd5738a6016661bdfccb78c105f3ce081c89735bc9d * 4;
}

// name: Anisotropic Samples %
// description: % of texture samples with anisotropic filtering
// type: Percentage
function AnisotropicSamplesPercent()
{
    return (_838e506beb7a1376c2242cd5738a6016661bdfccb78c105f3ce081c89735bc9d * 100) / TextureQuads();
}

// name: Mipmap Linear Samples
// description: Number of texture samples with linear mipmap filter
// type: Count
function MipmapLinearSamples()
{
    return _b7afe579643b48d1495eb528fa5a78db4c0a065f75636f39f24f9cf4578912cf * 4;
}

// name: Mipmap Linear Samples %
// description: % of texture samples with linear mipmap filter
// type: Percentage
function MipmapLinearSamplesPercent()
{
    return (_b7afe579643b48d1495eb528fa5a78db4c0a065f75636f39f24f9cf4578912cf * 100) / TextureQuads();
}

// name: Mipmap Nearest Samples
// description: Number of texture samples with nearest mipmap filter
// type: Count
function MipmapNearestSamples()
{
    return _443fdcc2095b4dca2f7e327fb6af5914523d670164b66d05316044de82474149 * 4;
}

// name: Mipmap Nearest Samples %
// description: % of texture samples with nearest mipmap filter
// type: Percentage
function MipmapNearestSamplesPercent()
{
    return (_443fdcc2095b4dca2f7e327fb6af5914523d670164b66d05316044de82474149 * 100) / TextureQuads();
}

// name: Compressed Texture Samples
// description: Number of compressed texture samples
// type: Count
function CompressedSamples()
{
    var CompressedSamples = _c9c95eb1a34eb7174e53a1b1edaf53792e68f9976bc8eb07fce8ad493bddc08e +
                            _3de788cd53ebf174aa407ea16ef4db42a9c5b26ec73c4d2f90713dd56d65f333 +
                            _fa01d5329f611805a99f4699e796d485f8f993df07816be0c8b15ac5e39951ea +
                            _0b4c966855c4b581f07ec85a1491cb234d31a838aaf82adc9427d3b2497bd31c +
                            _3bdd2971a0eab63c90d85f332aaf54f1f94663a4057f3c5d7619e2442d091a31 +
                            _4e088158f4d8adbbe88420686b1cb8700f71b4a42277c8b25c3f00bb97008361 +
                            _0427b329a9bf6f3b297e589bdebcd2e8a222101e677f95061e2fbe6fbe4ffa6f +
                            _4abe7d6426efbcb52bcc749d398c408464e07bccc54a687a42b794009dee6158 +                            
                            _71b154ef77c3d0492cf30c6594c523c8abe3285ee44c7f73c15ab86fabc4f05e +
                            _e2eebf0eaa57027e8dfa6003d4f8f90fb00c3666b62e391d060b8730c80b020f +
                            _46ed86682cc445fce72ee444d0a285905c9acb73971662dc88cf1fbc7f637928 +
                            _ccbd9b2a02319dfae2b510714bf280d5869ae5b980a89f854023778e59e8fb8b +
                            _0170b0014687cc7dc054a9619094bc011a05d098930b07f0b7dab0bcabae9406 +
                            _282cfcc4b531f88df1917e61edd71b551c4de0f3cc74785a95cdeaf421efefe2;

    return CompressedSamples * 4;
}

// name: Compressed Samples %
// description: Percentage of samples to compressed textures
// type: Percentage
function CompressedSamplesPercent()
{
    return Math.min((CompressedSamples() * 100.0) / Math.max(TextureQuads() * 4, 1.0), 100.0);
}

// name: Lossless Compressed Texture Samples
// description: Number of lossless compressed texture samples
// type: Count
function LosslessCompressedSamples()
{
    return _7cdc2c85e61923202c5936567bb447b8929b55e3fadd72277ff0796a99a7bdb4 * 4;
}

// name: Lossless Compressed Samples %
// description: Percentage of samples to compressed textures
// type: Percentage
function LosslessCompressedSamplesPercent()
{
    return Math.min((LosslessCompressedSamples() * 100.0) / Math.max(TextureQuads() * 4, 1.0), 100.0);
}

// name: Uncompressed Texture Samples
// description: Number of uncompressed texture samples
// type: Count
function UncompressedSamples()
{
    return Math.max(TextureQuads()*4 - (CompressedSamples() + LosslessCompressedSamples()), 0);
}

// name: Uncompressed Samples %
// description: Percentage of samples to compressed textures
// type: Percentage
function UnCompressedSamplesPercent()
{
    return Math.min(100.0 * UncompressedSamples() / Math.max(TextureQuads()*4, 1.0), 100.0);
}

// name: Pixels Written to Memory Unbiased
// description: Number of pixels unbiased written to memory
// type: Count
function PixelsUnbiasedWrittenToMemory()
{
    return _f406f88bdd312ec0455d0943c388de77e53b86cf0109624b028c3aa596ec3bf4 * 4;
}    

// name: Texture Pixels Written to Memory by Pixel Write Instructions
// description: Number of texture pixels written to memory
// type: Count
function TexturePixelsWrittenToMemory()
{
    return _03e06857325a0de8f5a4a0e55c75600fdbc3320b641d3263a95784fa16e2aaa1 * 4;
}

// name: Pixels Written to Memory
// description: Number of pixels written to memory
// type: Count
function PixelsWrittenToMemory()
{
    return Math.max(PixelsUnbiasedWrittenToMemory(), TexturePixelsWrittenToMemory());
}

// name: Attachment Pixels Written to Memory
// description: Number of pixels written to memory
// type: Count
function AttachmentPixelsWrittenToMemory()
{
    return Math.max(PixelsUnbiasedWrittenToMemory() - TexturePixelsWrittenToMemory(), 0.0);
}

// name: Compressed Pixels Written to Memory
// description: Number of compressed pixels written to memory
// type: Count
function CompressedPixelsWrittenToMemory()
{
    return _d2a9ad5555cf691ed8c64858ebd4a530a83d601bb356314c24c2f03df645597c * 4;
}

// name: Percentage of Texture Pixels Written to Memory by Pixel Write Instructions
// description: Number of texture pixels written to memory
// type: Percentage
function TexturePixelsWrittenToMemoryPercent()
{
    return 100.0 * TexturePixelsWrittenToMemory() / Math.max(PixelsWrittenToMemory(), 1.0);
}

// name: Percentage of Attachment Pixels Written to Memory
// description: Percentage of number of attachment pixels written to memory
// type: Percentage
function AttachmentPixelsWrittenToMemoryPercent()
{
    return 100.0 * AttachmentPixelsWrittenToMemory() / Math.max(PixelsWrittenToMemory(), 1.0);
}

// name: Percentage of Compressed Pixels Written to Memory
// description: Percentage of number of compressed pixels written to memory
// type: Percentage
function CompressedPixelsWrittenToMemoryPercent()
{
    return 100.0 * CompressedPixelsWrittenToMemory() / Math.max(PixelsWrittenToMemory(), 1.0);
}

// name: Number of 2xMSAA Resolved Pixels
// description: Number of 2xMSAA resolved pixels
// type: Count
function MSAA2XResolvedPixels()
{
    return _66eafb3ddb63687a1eef3817f25c70385aeb51f41d76b5cbdc5aa69a556bb76c * 4;
}

// name: Number of 4xMSAA Resolved Pixels
// description: Number of 4xMSAA resolved pixels
// type: Count
function MSAA4XResolvedPixels()
{
    return _788f9865b6b4897849bedfd577403fe30b882c1c6c2afcdbf2a9f8a0d41e741b * 4;
}

// name: Number of 2xMSAA Resolved Pixels
// description: Number of 2xMSAA resolved pixels
// type: Percentage
function MSAA2XResolvedPixelsPercent()
{
    return 100.0 * (MSAA2XResolvedPixels() / Math.max(PixelsWrittenToMemory(), 1.0));
}

// name: Number of 4xMSAA Resolved Pixels
// description: Number of 4xMSAA resolved pixels
// type: Percentage
function MSAA4XResolvedPixelsPercent()
{
    return 100.0 * (MSAA4XResolvedPixels() / Math.max(PixelsWrittenToMemory(), 1.0));
}


// name: Number of Total Resolved Pixels
// description: Number of total resolved pixels
// type: Count
function TotalResolvedPixels()
{
    return (_92e4033c73762edd1ce117ae25bceecf0ae126712bf861ca430c8049f845b9ff + _37b62c762d1c23168d0c25f1bc6033c6ee17922f5e31eab8d0cd946eb40ff5f3 + _984b0993354750161fe0018879ef125f6e3d98a5cbd800796dba5fb611df1651 + _6bb7d08e271a527bc1e586380563ec0de8de7e58c81e7b417ac1ecb39790c288) * 4.0;
}

// name: Average Unique Colors Per Resolved Pixels
// description: Average unique colors per resolved pixels
// type: Rate
function AverageUniqueColorsPerResolvedPixels()
{    
    return 4.0 * (_92e4033c73762edd1ce117ae25bceecf0ae126712bf861ca430c8049f845b9ff + 2.0*_37b62c762d1c23168d0c25f1bc6033c6ee17922f5e31eab8d0cd946eb40ff5f3 + 3.0*_984b0993354750161fe0018879ef125f6e3d98a5cbd800796dba5fb611df1651 + 4.0*_6bb7d08e271a527bc1e586380563ec0de8de7e58c81e7b417ac1ecb39790c288) / Math.max(TotalResolvedPixels(), 1.0);
}

// name: Texture Sample Limiter
// description: Measures the time during which texture samples are attempted to execute as a percentage of peak texture sample performance.
// type: Percentage
function TPULimiter()
{
    return _7646a8523871192073a29fb3af219f4dbddae3339e969e0da8ef8d84a3d46ec5_norm / (2.0 * num_cores);
}   

// name: Vertex Texture Sample Limiter
// description: Vertex texture sample limiter
// type: Percentage
function VertexTPULimiter()
{
    return _7646a8523871192073a29fb3af219f4dbddae3339e969e0da8ef8d84a3d46ec5_norm_vtx / (2.0 * num_cores);
}   

// name: Fragment Texture Sample Limiter
// description: Fragment texture sample limiter
// type: Percentage
function FragmentTPULimiter()
{
    return _7646a8523871192073a29fb3af219f4dbddae3339e969e0da8ef8d84a3d46ec5_norm_frg / (2.0 * num_cores);
}   

// name: ALU Limiter
// description: Measures the time during which ALU work is attempted to execute as a percentage of peak ALU performance.
// type: Percentage
function ALULimiter()
{    
    return (_c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_norm + _d201fed97c60848e3714502b203a0ad4e2820937c140dbf6a9db1cb31be194dd_norm) * 2 / num_cores;
}

// name: Vertex ALU Limiter
// description: Vertex ALU Limiter
// type: Percentage
function VertexALULimiter()
{
    return (_c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_norm_vtx + _d201fed97c60848e3714502b203a0ad4e2820937c140dbf6a9db1cb31be194dd_norm_vtx) * 2 / num_cores;
}

// name: Fragment ALU Limiter
// description: Fragment ALU Limiter
// type: Percentage
function FragmentALULimiter()
{
    return (_c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_norm_frg + _d201fed97c60848e3714502b203a0ad4e2820937c140dbf6a9db1cb31be194dd_norm_frg) * 2 / num_cores;
}

// name: Texture Write Limiter
// description: Texture write limiter
// type: Percentage
function PBELimiter()
{
    return (_bb9dbea90df77e54beebae872b35923d727fd2a59d6905410b32092d6d561402_norm + _63b42fb9d33e39b5f913060438c759d841275b394631cb7a8145853e9a04ef67_norm) / num_cores;
}

// name: VS Texture Write Limiter
// description: VS Texture write limiter
// type: Percentage
function VertexPBELimiter()
{
    return (_bb9dbea90df77e54beebae872b35923d727fd2a59d6905410b32092d6d561402_norm_vtx + _63b42fb9d33e39b5f913060438c759d841275b394631cb7a8145853e9a04ef67_norm_vtx) / num_cores;
}

// name: FS Texture Write Limiter
// description: FS Texture write limiter
// type: Percentage
function FragmentPBELimiter()
{
    return (_bb9dbea90df77e54beebae872b35923d727fd2a59d6905410b32092d6d561402_norm_frg + _63b42fb9d33e39b5f913060438c759d841275b394631cb7a8145853e9a04ef67_norm_frg) / num_cores;
}

// name: Sample Limiter
// description: % Sample Limiter
// type: Percentage
function SampleLimiter()
{
    return TPULimiter();
}

// name: VS Sample Limiter
// description: % VS Sample Limiter
// type: Percentage
function VertexSampleLimiter()
{
    return VertexTPULimiter();
}

// name: FS Sample Limiter
// description: % FS Sample Limiter
// type: Percentage
function FragmentSampleLimiter()
{
    return FragmentTPULimiter();
}

// name: Threadgroup/Imageblock Load Limiter
// description: Measures the time during which threadgroup and imageblock threadgroup loads are attempted to execute as a percentage of peak threadgroup and imageblock threadgroup performance.
// type: Percentage
function LocalLoadLimiter()
{
    return _7297c7ee63bc3f774b2e5f2e665cd87efcbf40dd3e6b66a9c08f8ebfdae4019e_norm / (1.0 * num_cores);
}

// name: VS Threadgroup/Imageblock Load Limiter
// description: VS Threadgroup/Imageblock load limiter
// type: Percentage
function VertexLocalLoadLimiter()
{
    return _7297c7ee63bc3f774b2e5f2e665cd87efcbf40dd3e6b66a9c08f8ebfdae4019e_norm_vtx / (1.0 * num_cores);
}

// name: FS Threadgroup/Imageblock Load Limiter
// description: FS Threadgroup/Imageblock load limiter
// type: Percentage
function FragmentLocalLoadLimiter()
{
    return _7297c7ee63bc3f774b2e5f2e665cd87efcbf40dd3e6b66a9c08f8ebfdae4019e_norm_frg / (1.0 * num_cores);
}

// name: Threadgroup/Imageblock Store Limiter
// description: Measures the time during which threadgroup and imageblock threadgroup stores are attempted to execute as a percentage of peak threadgroup and imageblock threadgroup performance.
// type: Percentage
function LocalStoreLimiter()
{
    return (_192193e6c7ce23b86614fecbd983be5c3d4ea08d47c42ee19db85a736c0cbf7e_norm) / (1.0 * num_cores);
}

// name: VS Threadgroup/Imageblock Store Limiter
// description: VS Threadgroup/Imageblock store limiter
// type: Percentage
function VertexLocalStoreLimiter()
{
    return _192193e6c7ce23b86614fecbd983be5c3d4ea08d47c42ee19db85a736c0cbf7e_norm_vtx / (1.0 * num_cores);
}

// name: FS Threadgroup/Imageblock Store Limiter
// description: FS Threadgroup/Imageblock store limiter
// type: Percentage
function FragmentLocalStoreLimiter()
{
    return _192193e6c7ce23b86614fecbd983be5c3d4ea08d47c42ee19db85a736c0cbf7e_norm_frg / (1.0 * num_cores);
}

// name: Threadgroup Atomic Limiter
// description: Measures the time during which threadgroup atomics are attempted to execute as a percentage of peak threadgroup performance.
// type: Percentage
function LocalAtomicsLimiter()
{
    return (_102d161027c9cd6bf8752b3bcbbe48ec7879b593c584521ed0be10b44ee0f74c_norm + _f6aba336a7053251ccdb48a792232046e64961084645e162a508593a1676624d_norm) / (1.0 * num_cores);
}

// name: Texture Cache Read Miss Rate
// description: Percentage of time L1 Texture Cache read access is a Miss
// type: Percentage
function TextureCacheMissRate()
{
    return _867226b78b975653eb9f9d171ce53bedbf3edbc1ee1af8aa960cb9db4ec6490f * 100 / _df20e560276a18cd9b97f03f47abf0d8bf719014920913d325c6ad5d4ab98453;
}

// name: Texture Cache Write Miss Rate in Vertex Shader
// description: Percentage of time L1 Texture Cache write access is a Miss for Vertex Shader
// type: Percentage
function VSTextureCacheWriteMissRate()
{
    return _f430991e42f778aeda210861eca9b8cef241898007339644eff469d83e5a6c9d_vtx * 100.0 / (_f430991e42f778aeda210861eca9b8cef241898007339644eff469d83e5a6c9d_vtx + _3459b3e3f2f8a441719d05aae2161786eded99c72d7215bb6797f836d46a3426_vtx); 
}

// name: Texture Cache Write Miss Rate in Fragment Shader
// description: Percentage of time L1 Texture Cache write access is a Miss for Fragment Shader
// type: Percentage
function FSTextureCacheWriteMissRate()
{
    return _f430991e42f778aeda210861eca9b8cef241898007339644eff469d83e5a6c9d_frg * 100.0 / (_f430991e42f778aeda210861eca9b8cef241898007339644eff469d83e5a6c9d_frg + _3459b3e3f2f8a441719d05aae2161786eded99c72d7215bb6797f836d46a3426_frg); 
}

// name: Texture Cache Write Miss Rate
// description: Percentage of time L1 Texture Cache write access is a Miss
// type: Percentage
function TextureCacheWriteMissRate()
{
    return _f430991e42f778aeda210861eca9b8cef241898007339644eff469d83e5a6c9d * 100.0 / (_f430991e42f778aeda210861eca9b8cef241898007339644eff469d83e5a6c9d + _3459b3e3f2f8a441719d05aae2161786eded99c72d7215bb6797f836d46a3426); 
}

// name: VS Bytes Read From Main Memory
// description: Total bytes read from main memory in Vertex Shader
// type: Value
function VSBytesReadFromMainMemory()
{
    return 64.0 * (_e7982344eb9c10ce1e1e9e179c01bb8a55934656fd5d499f956d6e35e42f1f10_vtx + _aac2d2ece8ff1acbf2ab0f821c8f1e4e2dbb2ca4c3a6918e2dc458dfab8ee05c_vtx);
}

// name: FS Bytes Read From Main Memory
// description: Total bytes read from main memory in Fragment Shader
// type: Value
function FSBytesReadFromMainMemory()
{
    return 64.0 * (_e7982344eb9c10ce1e1e9e179c01bb8a55934656fd5d499f956d6e35e42f1f10_frg + _aac2d2ece8ff1acbf2ab0f821c8f1e4e2dbb2ca4c3a6918e2dc458dfab8ee05c_frg);
}

// name: Bytes Read From Main Memory
// description: Total bytes read from main memory
// type: Value
function BytesReadFromMainMemory()
{
    return 64.0 * (_e7982344eb9c10ce1e1e9e179c01bb8a55934656fd5d499f956d6e35e42f1f10 + _aac2d2ece8ff1acbf2ab0f821c8f1e4e2dbb2ca4c3a6918e2dc458dfab8ee05c);
}

// name: Bytes Written To Main Memory in Vertex Shader
// description: Total bytes written to main memory in vertex shader
// type: Value
function VSBytesWrittenToMainMemory()
{
    return 64.0 * _190175e7010a5c90cc957e3f3eed64c3910111ef228808fbb2462cd269524ef5_vtx;
}

// name: Bytes Written To Main Memory in Fragment Shader
// description: Total bytes written to main memory in fragment shader
// type: Value
function FSBytesWrittenToMainMemory()
{
    return 64.0 * _190175e7010a5c90cc957e3f3eed64c3910111ef228808fbb2462cd269524ef5_frg;
}

// name: Bytes Written To Main Memory
// description: Total bytes written to main memory
// type: Value
function BytesWrittenToMainMemory()
{
    return 64.0 * _190175e7010a5c90cc957e3f3eed64c3910111ef228808fbb2462cd269524ef5;
}

// name: VS Global Atomic Bytes Read
// description: Total global atomic bytes read in Vertex Shader
// type: Value
function VSTotalGlobalAABytesRead()
{    
    return 64.0 * (_4b059bd404948478ca16baf541647a86b98abe90760ff835857e869ddf1825e9_vtx + _0b196f382d876b6f84ce827e6ca92ceff947d162dd7041d6e2383c0b0ac16b2e_vtx);
}

// name: FS Global Atomic Bytes Read
// description: Total global atomic bytes read in fragment shader
// type: Value
function FSTotalGlobalAABytesRead()
{
    return 64.0 * (_4b059bd404948478ca16baf541647a86b98abe90760ff835857e869ddf1825e9_frg + _0b196f382d876b6f84ce827e6ca92ceff947d162dd7041d6e2383c0b0ac16b2e_frg);
}

// name: Global Atomic Bytes Read
// description: Total global atomic bytes read
// type: Value
function TotalGlobalAABytesRead()
{
    return 64.0 * (_4b059bd404948478ca16baf541647a86b98abe90760ff835857e869ddf1825e9 + _0b196f382d876b6f84ce827e6ca92ceff947d162dd7041d6e2383c0b0ac16b2e);
}

// name: VS Global Atomic Bytes Written
// description: Total global atomic bytes written in Vertex Shader
// type: Value
function VSTotalGlobalAABytesWritten()
{
    return 64.0 * (_3c6dba64fd85b35b8b8339f1d322943087d45cbb9b6689c587fd76259587a9d8_vtx + _9153a820a764c5c32c10432035db3a4194ee169ef665e8fc7297bd5592b39e62_vtx);
}

// name: FS Global Atomic Bytes Written
// description: Total global atomic bytes written in fragment shader
// type: Value
function FSTotalGlobalAABytesWritten()
{
    return 64.0 * (_3c6dba64fd85b35b8b8339f1d322943087d45cbb9b6689c587fd76259587a9d8_frg + _9153a820a764c5c32c10432035db3a4194ee169ef665e8fc7297bd5592b39e62_frg);
}

// name: Global Atomic Bytes Written
// description: Total global atomic bytes written
// type: Value
function TotalGlobalAABytesWritten()
{
    return 64.0 * (_3c6dba64fd85b35b8b8339f1d322943087d45cbb9b6689c587fd76259587a9d8 + _9153a820a764c5c32c10432035db3a4194ee169ef665e8fc7297bd5592b39e62);
}

// name: VS L2 Bytes Read
// description: Total L2 bytes read in Vertex Shader
// type: Value
function VSTotalL2BytesRead()
{
    return 64.0 * (_ef52925e500884ba6b276e576ae78b97fd8448dfadeba596c2202b5202e246c3_vtx + _43fe12d20dfe3a9ea7b303773d624405e026e20b2c550822f2587997d2557f13_vtx + _0d5290b07753d1bbf223d0700438322c356bc6d3f028bf47df09e81f21da75c6_vtx + _3329a7bf90f5b81c24f86beffadfc66daefb2b2f45b08cdb822f931dac7370d6_vtx) + VSTotalGlobalAABytesRead();
}

// name: FS L2 Bytes Read
// description: Total L2 bytes read in fragment shader
// type: Value
function FSTotalL2BytesRead()
{
return 64.0 * (_ef52925e500884ba6b276e576ae78b97fd8448dfadeba596c2202b5202e246c3_frg + _43fe12d20dfe3a9ea7b303773d624405e026e20b2c550822f2587997d2557f13_frg + _0d5290b07753d1bbf223d0700438322c356bc6d3f028bf47df09e81f21da75c6_frg + _3329a7bf90f5b81c24f86beffadfc66daefb2b2f45b08cdb822f931dac7370d6_frg) + FSTotalGlobalAABytesRead();
}

// name: L2 Bytes Read
// description: Total L2 bytes read
// type: Value
function TotalL2BytesRead()
{
    return 64.0 * (_3329a7bf90f5b81c24f86beffadfc66daefb2b2f45b08cdb822f931dac7370d6 + _ef52925e500884ba6b276e576ae78b97fd8448dfadeba596c2202b5202e246c3 + _43fe12d20dfe3a9ea7b303773d624405e026e20b2c550822f2587997d2557f13 + _0d5290b07753d1bbf223d0700438322c356bc6d3f028bf47df09e81f21da75c6) + TotalGlobalAABytesRead();
}


// name: VS L2 bytes written
// description: Total L2 Bytes Written in vertex shader
// type: Value
function VSTotalL2BytesWritten()
{
    return 64.0 * (_d7a23701e11432625d46f02ff35668e60e55a7706704976facfe5fbeea3b1936_vtx + _88723e1253a5c3264f69b1fbf3a6b7f3ab67bbd9fe97afeedb649146b3b8b043_vtx + _56a63abf333e0f9f06f1a00635d4125c3910b3c00286e4fb3652687402916c8a_vtx) + VSTotalGlobalAABytesWritten()
}

// name: FS L2 Bytes Written
// description: Total L2 bytes written in fragment shader
// type: Value
function FSTotalL2BytesWritten()
{
    return 64.0 * (_d7a23701e11432625d46f02ff35668e60e55a7706704976facfe5fbeea3b1936_frg + _88723e1253a5c3264f69b1fbf3a6b7f3ab67bbd9fe97afeedb649146b3b8b043_frg + _56a63abf333e0f9f06f1a00635d4125c3910b3c00286e4fb3652687402916c8a_frg) + FSTotalGlobalAABytesWritten()
}

// name: L2 Bytes Written
// description: Total L2 bytes written
// type: Value
function TotalL2BytesWritten()
{
    return 64.0 * (_d7a23701e11432625d46f02ff35668e60e55a7706704976facfe5fbeea3b1936 + _88723e1253a5c3264f69b1fbf3a6b7f3ab67bbd9fe97afeedb649146b3b8b043 + _56a63abf333e0f9f06f1a00635d4125c3910b3c00286e4fb3652687402916c8a) + TotalGlobalAABytesWritten()
}

// name: VS Total Texture L1 Bytes Read
// description: Total bytes read from texture L1 cache in vertex shader
// type: Value
function VSTotalBytesReadFromTextureL1Cache()
{
    return _df20e560276a18cd9b97f03f47abf0d8bf719014920913d325c6ad5d4ab98453_vtx * 64.0;
}

// name: FS Total Texture L1 Bytes Read
// description: Total bytes read from texture L1 cache in fragment shader
// type: Value
function FSTotalBytesReadFromTextureL1Cache()
{
    return _df20e560276a18cd9b97f03f47abf0d8bf719014920913d325c6ad5d4ab98453_frg * 64.0;
}

// name: Texture L1 Bytes Read
// description: Total bytes read from texture L1 cache
// type: Value
function TotalBytesReadFromTextureL1Cache()
{
    return _df20e560276a18cd9b97f03f47abf0d8bf719014920913d325c6ad5d4ab98453 * 64.0;
}

// name: VS Buffer L1 Bytes Read
// description: Total bytes read from buffer L1 cache in vertex shader
// type: Value
function VSTotalBytesReadFromBufferL1Cache()
{
    return _8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_vtx * 16.0;
}

// name: FS Buffer L1 Bytes Read
// description: Total bytes read from buffer L1 cache in fragment shader
// type: Value
function FSTotalBytesReadFromBufferL1Cache()
{
    return _8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_frg * 16.0;
}

// name: Buffer L1 Bytes Read
// description: Total bytes read from buffer L1 cache
// type: Value
function TotalBytesReadFromBufferL1Cache()
{
    return _8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015 * 16.0;
}

// name: VS Buffer L1 Bytes Written
// description: Total bytes written to buffer L1 cache in vertex shader
// type: Value
function VSTotalBytesWrittenBufferL1Cache()
{
    return _3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_vtx * 16.0;
}

// name: FS Buffer L1 Bytes Written
// description: Total bytes written to buffer L1 cache in fragment shader
// type: Value
function FSTotalBytesWrittenBufferL1Cache()
{
    return _3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_frg * 16.0;
}

// name: Buffer L1 Bytes Written
// description: Total bytes written to buffer L1 cache
// type: Value
function TotalBytesWrittenBufferL1Cache()
{
    return _3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5 * 16.0;
}

// name: Predicated Texture Thread Writes
// description: Percentage thread predicated out due to divergent control flow or small primitives covering part of quad in the render target on texture writes
// type: Percentage
function PredicatedTextureWritePercentage()
{
    if (_f406f88bdd312ec0455d0943c388de77e53b86cf0109624b028c3aa596ec3bf4 + _9da983fb76d81017bb17c1307769e9cdaa3547cc33eadcf7f389043343c66b31 > 0)
    {
        return Math.max(100.0 * (1.0 - _f406f88bdd312ec0455d0943c388de77e53b86cf0109624b028c3aa596ec3bf4 / _9da983fb76d81017bb17c1307769e9cdaa3547cc33eadcf7f389043343c66b31), 0.0);
    }
    return 0.0;
}

// name: Predicated Texture Thread Reads
// description: Percentage threads predicated out due to divergent control flow or small primitives covering part of quad in the render target on texture reads
// type: Percentage
function PredicatedTextureReadPercentage()
{
    if (TextureAccesses() > 0)
    {
        return Math.max(100.0 * (1.0 - TextureAccesses() / Math.max(4.0*TextureQuads(), 1.0)), 0.0);
    }
    return 0.0;
}

// name: Samples Shaded Per Tile
// description: Samples shaded per tile
// type: Rate
function SamplesShadedPerTile()
{
    return 64.0 * _416b2a4855c3ad10e45eaab8493e7651ad66f8e3d44ad880fa8111c87ccd090a / _eda5bce70befa39e7c6029505c0269211092c220048a502fd8fa2fe30895465b;
}

// name: Samples Shaded Per Quad
// description: Samples shaded per quad
// type: Rate
function SamplesShadedPerQuad()
{
    return 64.0 * _416b2a4855c3ad10e45eaab8493e7651ad66f8e3d44ad880fa8111c87ccd090a / Math.max(4.0 * _ca0d54323c1777d994357aaacdb7beac572bea11cd16afed4c756f3dc9496a18, 1.0);
}

// name: VS Predicated Out ALU Percentage
// description: Percentage issued ALU operations predicated out due to divergent control flow in the verex shader
// type: Percentage
function VSPredicatedALUPercentage()
{
    var instructionsIssued = 128.0 * (_0af59bb3dd0a90f2664cd5e5601b3c56bf91e40478def55647411007dc5394d3_vtx + _a6e6cc683eebf697b2a31bd7d4f877afee2419f6882f55b2f4ea296c9a368b99_vtx + _4ffbecab1c5697bfb927de016f6ddd4b010ddb0588049be5243c148e62d21409_vtx + _04ec68f75ab42cefa364623ffb059b101b9d6d35ed0e59abbbc94170b4ec6cbe_vtx);
    var instructionsExecuted = 16.0 * (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d_vtx + _8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a_vtx + _23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03_vtx + _827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb_vtx);

    if (instructionsIssued + instructionsExecuted > 0)
    {
        return Math.max(100.0 * (1.0 - instructionsExecuted / instructionsIssued), 0.0);
    }
    return 0.0;
}

// name: FS Predicated Out ALU Percentage
// description: Percentage issued ALU operations predicated out due to divergent control flow in the fragment shader
// type: Percentage
function FSPredicatedALUPercentage()
{
    var instructionsIssued = 128.0 * (_0af59bb3dd0a90f2664cd5e5601b3c56bf91e40478def55647411007dc5394d3_frg + _a6e6cc683eebf697b2a31bd7d4f877afee2419f6882f55b2f4ea296c9a368b99_frg + _4ffbecab1c5697bfb927de016f6ddd4b010ddb0588049be5243c148e62d21409_frg + _04ec68f75ab42cefa364623ffb059b101b9d6d35ed0e59abbbc94170b4ec6cbe_frg);
    var instructionsExecuted = 16.0 * (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d_frg + _8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a_frg + _23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03_frg + _827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb_frg);

    if (instructionsIssued + instructionsExecuted > 0)
    {
        return Math.max(100.0 * (1.0 - instructionsExecuted / instructionsIssued), 0.0);
    }
    return 0.0;
}

// name: Kernel Predicated Out ALU Percentage
// description: Percentage issued ALU operations predicated out due to divergent control flow in the compute shader
// type: Percentage
function CSPredicatedALUPercentage()
{
    var instructionsIssued = 128.0 * (_0af59bb3dd0a90f2664cd5e5601b3c56bf91e40478def55647411007dc5394d3_cmp + _a6e6cc683eebf697b2a31bd7d4f877afee2419f6882f55b2f4ea296c9a368b99_cmp + _4ffbecab1c5697bfb927de016f6ddd4b010ddb0588049be5243c148e62d21409_cmp + _04ec68f75ab42cefa364623ffb059b101b9d6d35ed0e59abbbc94170b4ec6cbe_cmp);
    var instructionsExecuted = 16.0 * (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d_cmp + _8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a_cmp + _23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03_cmp + _827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb_cmp);

    if (instructionsIssued + instructionsExecuted > 0)
    {
        return Math.max(100.0 * (1.0 - instructionsExecuted / instructionsIssued), 0.0);
    }
    return 0.0;
}

// name: Thread Group Bytes Read
// description: Total bytes read from thread group memory
// type: Value
function TotalBytesReadFromThreadGroupMemory()
{
    return 32.0 * 4.0 * _3c3dc9a24c6f8ab640c0ea8f6372c66cec9c6d0ac7a42871c7d4ee9d78918fb2;
}

// name: Thread Group Bytes Written
// description: Total bytes written to thread group memory
// type: Value
function TotalBytesWrittenThreadGroupMemory()
{
    return 32.0 * 4.0 * (_77c64a76c3a1882e7551dd3fa1188c7e4a8a0872b57fd0cb1587664cab0899eb + _db2becdf2b6af3ea5925b1f3846185031c9e83a49f8676e9c226731bf3007e10);
}

// name: Thread Group Bytes Read and Written
// description: Total bytes read and written to thread group memory
// type: Value
function TotalAtomicBytesThreadGroupMemory()
{
    return 32.0 * 4.0 * _db2becdf2b6af3ea5925b1f3846185031c9e83a49f8676e9c226731bf3007e10;
}

// name: Compression Ratio of Texture Memory Written
// description: Ratio of compressed to uncomressed texture memory written
// type: Rate
function CompressionRatioTextureMemoryWritten()
{
    var cmpUncompressedDataBytes = _b4a97f86133bb31ea8cf25afb427cb7dc1fe52552105fcd8bc3c4aa7ad099a78 + _9969883349fe2838e0be35dff1762942e9491b337c7b0ba46661003a330996ac + _868dda8bb614bc2256251603b58ea88fa9ebfde94214a32cac586b56bc8a0fdc + _001df138804c389a08dc6f67112cad9b15228d51415c964e384102355b0ff784;
    var cmpCompressedDataBytes   = _f8d12ed1fd4a2c10df5bc36ac39f6108a81c23c312389616fd2fa2fbf882c94a + _c9b7b4db80ce4f449662cc8a655a128294ce8cb63a963492682ad9c02a338a46 + 2.0* _4167773bd45e5e4d7f626a716b9775f840b172225798dd96b00c6f7f0290d75e;

    return cmpUncompressedDataBytes / Math.max(cmpCompressedDataBytes, 1);
}

// name: Compression Ratio of Texture Memory Read
// description: Ratio of compressed to uncomressed texture memory read
// type: Rate
function CompressionRatioTextureMemoryRead()
{
    return (_1827ca25b7318e2df60eb0fe4f0c290b43054021ec3233e1fcdcf7b622fe4589 + _04d4411374e68233627aa77e33b97414d97097b7d3599dc0555f05e8ba0c27ad) / Math.max(_127d5295001f8af60ca5165221e36d79521a187e9c43940c9ea618e0d2d7c316, 1);
}

// name: VS Arithmetic Intensity
// description: ALU ops per byte of main memory traffic in vertex shader
// type: Rate
function VSArithmeticIntensity()
{
    return VSALUInstructions() / Math.max(1, VSBytesReadFromMainMemory() + VSBytesWrittenToMainMemory());
}

// name: FS Arithmetic Intensity
// description: ALU Time in nSec per byte of main memory transfer in fragment shader
// type: Rate
function FSArithmeticIntensity()
{
    return FSALUInstructions() / Math.max(1, FSBytesReadFromMainMemory() + FSBytesWrittenToMainMemory());
}

// name: CS Arithmetic Intensity
// description: ALU ops per byte of main memory traffic in compute shader
// type: Rate
function CSArithmeticIntensity()
{
    return CSALUInstructions() / Math.max(1, BytesReadFromMainMemory() + BytesWrittenToMainMemory());
}

// name: VS Main Memory Throughput
// description: Main memory throughput in GB/s in a vertex shader
// type: Rate
function VSMainMemoryThroughput()
{
    return (VSBytesReadFromMainMemory() + VSBytesWrittenToMainMemory()) / Math.max(1, (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e_vtx * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6));
}

// name: FS Main Memory Throughput
// description: Main memory throughput in GB/s in a fragment shader
// type: Rate
function FSMainMemoryThroughput()
{
    return (FSBytesReadFromMainMemory() + FSBytesWrittenToMainMemory()) / Math.max(1, (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e_frg * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6));
}

// name: Main Memory Throughput
// description: Main memory throughput in GB/s
// type: Rate
function MainMemoryThroughput()
{
    return (BytesReadFromMainMemory() + BytesWrittenToMainMemory()) / Math.max(1, (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6));
}

// name: Buffer Main Memory Bytes Read
// description: Total bytes read for buffers from main memory
// type: Value
function BytesReadForBuffersFromMainMemory()
{
    return 64.0 * _3524ddd7c801ffbe5b629d1aae54b01dce1bd5cbabcadbac658fb15c9f1135fa;
}

// name: VS Buffer Main Memory Bytes Read
// description: Total bytes read for buffers from main memory for vertex shader
// type: Value
function VSBytesReadForBuffersFromMainMemory()
{
    return 64.0 * _3524ddd7c801ffbe5b629d1aae54b01dce1bd5cbabcadbac658fb15c9f1135fa_vtx;
}

// name: FS Buffer Main Memory Bytes Read
// description: Total bytes read for buffers from main memory for fragment shader
// type: Value
function FSBytesReadForBuffersFromMainMemory()
{
    return 64.0 * _3524ddd7c801ffbe5b629d1aae54b01dce1bd5cbabcadbac658fb15c9f1135fa_frg;
}

// name: Buffer Main Memory Bytes Written
// description: Total bytes written for buffers from main memory
// type: Value
function BytesWrittenForBuffersFromMainMemory()
{
    return 64.0 * (_a32c12400dea485cc20dd5f3fdb5ff055d1fc219f7a22158f6f0175c5dfd6fea + _0f60736b8a04fb2447b61bcf47ac1adf6601e0325abfdff80b638638058feded);
}

// name: VS Buffer Main Memory Bytes Written
// description: Total bytes written for buffers from main memory for vertex shader
// type: Value
function VSBytesWrittenForBuffersFromMainMemory()
{
    return 64.0 * (_a32c12400dea485cc20dd5f3fdb5ff055d1fc219f7a22158f6f0175c5dfd6fea_vtx + _0f60736b8a04fb2447b61bcf47ac1adf6601e0325abfdff80b638638058feded_vtx);
}

// name: FS Buffer Main Memory Bytes Written
// description: Total bytes written for buffers from main memory for fragment shader
// type: Value
function FSBytesWrittenForBuffersFromMainMemory()
{
    return 64.0 * (_a32c12400dea485cc20dd5f3fdb5ff055d1fc219f7a22158f6f0175c5dfd6fea_frg + _0f60736b8a04fb2447b61bcf47ac1adf6601e0325abfdff80b638638058feded_frg);
}

// name: Texture Main Memory Bytes Written
// description: Total bytes written for textures to main memory
// type: Value
function TextureBytesWrittenToMainMemory()
{                
    return 64.0 * (_5bd1614f0c8060aefca1a2bd9a9e9ee750163626cdc0c38d723e94470730cfe6 + _5d503a1872859aa411818cfbcb70e41b501704501f31a039c3acb306fb382113 + _4167773bd45e5e4d7f626a716b9775f840b172225798dd96b00c6f7f0290d75e) + 128.0 * (_c5b103e58e91d43549acb4af04601a97cecc95caa0e6fe0c9c3c35a3a60fbd45 + _b6489d493ca65c9e43746d81294f5f613015fde58abf9a2945b0e6131c921e85);
}

// name: Texture Main Memory Bytes Read
// description: Total bytes read for textures from main memory
// type: Value
function TextureBytesReadFromMainMemory()
{
    return 64.0 * (_5dcbce50d229822aa963dcf83c2de8fbe54d8328f89e076ef096ddfd2fa7dd52 + _58ef35a421546beb70de0b899c35b32fe4d93474d5120fa782ebb62bf1f9683c);
}

// name: Buffer Read Limiter
// description: Measures the time during which buffer loads are attempted to execute as a percentage of peak buffer load performance.
// type: Percentage
function BufferLoadLimiter()
{
    return Math.min((_8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_norm + _d0699f5ce934818cd7248127feed214216e30183a27473bea81c3d3b90578ef9_norm) / (2.0 * num_cores), 100.0);
}  

// name: VS Buffer Read Limiter
// description: VS Buffer read limiter
// type: Percentage
function VertexBufferLoadLimiter()
{
    return Math.min((_8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_norm_vtx + _d0699f5ce934818cd7248127feed214216e30183a27473bea81c3d3b90578ef9_norm_vtx) / (2.0 * num_cores), 100.0);
}

// name: FS Buffer Read Limiter
// description: FS Buffer read limiter
// type: Percentage
function FragmentBufferLoadLimiter()
{
    return Math.min((_8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_norm_frg + _d0699f5ce934818cd7248127feed214216e30183a27473bea81c3d3b90578ef9_norm_frg) / (2.0 * num_cores), 100.0);
}

// name: Buffer Write Limiter
// description: Measures the time during which buffer stores are attempted to execute as a percentage of peak buffer load performance.
// type: Percentage
function BufferStoreLimiter()
{
    return Math.min((_3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_norm + _04619811825d9d1620326f0529902213ffb847ef304f2532afe9a5c8e581a633_norm) / (1.0 * num_cores), 100.0);
}

// name: VS Buffer Write Limiter
// description: VS Buffer write limiter
// type: Percentage
function VertexBufferStoreLimiter()
{    
    return Math.min((_3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_norm_vtx + _04619811825d9d1620326f0529902213ffb847ef304f2532afe9a5c8e581a633_norm_vtx) / (1.0 * num_cores), 100.0);
}

// name: FS Buffer Write Limiter
// description: FS Buffer write limiter
// type: Percentage
function FragmentBufferStoreLimiter()
{    
    return Math.min((_3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_norm_frg + _04619811825d9d1620326f0529902213ffb847ef304f2532afe9a5c8e581a633_norm_frg) / (1.0 * num_cores), 100.0);
}

// name: Fragment Input Interpolation Limiter
// description: Measures the time during which fragment shader input interpolation work is attempted to execute as a percentage of peak input interpolation performance.
// type: Percentage
function FragmentInputInterpolationLimiter()
{    
    return _90784375edce0b872bddf54d5fdc7e2419df531375843de0472b43e95edffe2b_norm / (1.0 * num_cores);
}

// name: GPU Last Level Cache Limiter
// description: Measures the time during which GPU’s last level cache is attempting to service read and write requests as a percentage of cache’s peak performance.
// type: Percentage
function L2CacheLimiter()
{
    return (_5c5c55d05fb355aa5be61ac63c88eb4a2a521a47dd8f79c18b5c1df163d5cb55_norm + _c9bcd5df6397dc8477a12ddf9358bccbbb3d8e52fc3dadab320be9bbb14fe157_norm) / (4.0 * num_mgpus);
}

// name: GPU Last Level Cache Limiter Miss Rate
// description: Percentage of times GPU’s last level cache lookups are misses
// type: Percentage
function L2CacheMissRate()
{
    return 100.0 * _44e2790fe56248cd45e2248d0f69699da605c77fab749daf6c865f1ab5f16563 / Math.max(_5c5c55d05fb355aa5be61ac63c88eb4a2a521a47dd8f79c18b5c1df163d5cb55, 1.0);
}

// name: Vertex Occupancy
// description: Measures how many vertex shader simdgroups are concurrently running in the GPU relative to the GPU’s maximum number of concurrently running simdgroups.
// type: Percentage
function VertexOccupancy()
{
    return _4bb4a72bfa974f38e0143eef87e93ae69847e8612684f014350fb4a8c0692050_norm / (_d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a * num_cores);
}

// name: Fragment Occupancy
// description: Measures how many fragment shader simdgroups are concurrently running in the GPU relative to the GPU’s maximum number of concurrently running simdgroups.
// type: Percentage
function FragmentOccupancy()
{
    return _367a60a3f4d39b45114c57a560ad1bad4f9f62798346ead3a98f790ad32537a6_norm / (_d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a * num_cores);
}

// name: Compute Occupancy
// description: Measures how many compute shader simdgroups are concurrently running in the GPU relative to the GPU’s maximum number of concurrently running simdgroups.
// type: Percentage
function ComputeOccupancy()
{
    return _6b3a9b25a65b692ad1039bcc4c052d5a85e40a9410946c0cdf5dc85d993e2131_norm / (_d56cff6c89d6a3f5f8561cd89f1b36b2760c125d908074d984bc36678982991a * num_cores);
}

// name: GPU Read Bandwidth
// description: Measures how much memory, in gigabytes per second, are read by the GPU from a memory external to the GPU (potentially main memory).
// type: Rate
function GPUReadBandwidth()
{    
    return BytesReadFromMainMemory() / Math.max(1, (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6));
}   

// name: GPU Write Bandwidth
// description: Measures how much memory, in gigabytes per second, are written by the GPU to a memory external to the GPU (potentially main memory).
// type: Rate
function GPUWriteBandwidth()
{    
    return BytesWrittenToMainMemory() / Math.max(1, (_792173079ffc5aacc2cea817d8812166e71ea17309e294d24ee2cc88d2fb1e8e * _ca35e381a2fdcb4f0dbc27e38f0b0bd85835a4197c6256f58d2c59888cb0fce6));
}   

// name: ALU Utilization
// description: ALU utilization
// type: Percentage
function ALUUtilization()
{
    return _c4c7e4c8f7b6488a9a980bba9f849c9e5d8e4bbb1e2c134cef7620b6faf7d6a2_norm * 2 / num_cores;
}

// name: F32 Utilization
// description: F32 utilization
// type: Percentage
function F32Utilization()
{
    return (_55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _a6e6cc683eebf697b2a31bd7d4f877afee2419f6882f55b2f4ea296c9a368b99_norm * 4) / (128 * num_cores);
}   

// name: F16 Utilization
// description: F16 utilization
// type: Percentage
function F16Utilization()
{
    return (_55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _0af59bb3dd0a90f2664cd5e5601b3c56bf91e40478def55647411007dc5394d3_norm * 4) / (128 * num_cores);
}

// name: IC Utilization
// description: IC utilization
// type: Percentage
function ICUtilization()
{
    return (_55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _04ec68f75ab42cefa364623ffb059b101b9d6d35ed0e59abbbc94170b4ec6cbe_norm * 4) / (32 * num_cores);
}

// name: IC Limiter
// description: IC Limiter
// type: Percentage
function ICLimiter()
{
    return Math.min(ICUtilization() + (_636ff14fa941ff8be0856e8b49a45d5528e569a56237a6cbbe9233c399fd5002_norm / num_cores), 100.0);
}

// name: SCIB Utilization
// description: SCIB utilization
// type: Percentage
function SCIBUtilization()
{
    return (_55d0c180ad87ec962138c5c289baadd6969fdd2cd21ef68ab1f91190b6c33812 * _4ffbecab1c5697bfb927de016f6ddd4b010ddb0588049be5243c148e62d21409_norm * 4) / (128 * num_cores);
}

// name: Texture Sample Utilization
// description: Texture sample utilization
// type: Percentage
function TextureSamplesUtilization()
{
    return _6d86d89a09a872e62b809325d49d6967e2327aa5d1d4ea471d700f29696b9560_norm / (2.0 * num_cores);
}

// name: Texture Write Utilization
// description: Texture write utilization
// type: Percentage
function TextureWritesUtilization()
{
    return _bb9dbea90df77e54beebae872b35923d727fd2a59d6905410b32092d6d561402_norm / (1.0 * num_cores);
}

// name: Buffer Load Utilization
// description: Buffer load utilization
// type: Percentage
function BufferLoadUtilization()
{
    return Math.min(_8cd74591f03ed3eb90e0c547b8bf21ae7eed4129053f40570cce56a39a690015_norm / (2 * num_cores), 100.0);
}

// name: Buffer Store Utilization
// description: Buffer store utilization
// type: Percentage
function BufferStoreUtilization()
{
    return Math.min(_3dfa6da703ded5b65a76ddf0aa3f7f28f19b4a624ef77347a925f55bf66a82f5_norm / (1 * num_cores), 100.0);
}

// name: Threadgroup/Imageblock Load Utilization
// description: Threadgroup/Imageblock load utilization
// type: Percentage
function LocalLoadUtilization()
{
    return (_5d6a90a3c3f5d373b4784fb5f1f7aa7743084eba64d8294172d1185916b9bd1c_norm) / (1.0 * num_cores);
}   

// name: Threadgroup/Imageblock Store Utilization
// description: Threadgroup/Imageblock store utilization
// type: Percentage
function LocalStoreUtilization()
{
    return (_a6959c95ec387b8177c7952dc2b0442397db237352d2eaac83f58ec8a91891b7_norm) / (1.0 * num_cores);
}

// name: Threadgroup Atomic Utilization
// description: Threadgroup atomic utilization
// type: Percentage
function LocalAtomicsUtilization()
{
    return (_102d161027c9cd6bf8752b3bcbbe48ec7879b593c584521ed0be10b44ee0f74c_norm) / (1.0 * num_cores);
}  

// name: Fragment Input Interpolation Utilization
// description: Fragment input interpolation utilization
// type: Percentage
function FragmentInputInterpolationUtilization()
{
    return _95b5e692e6eefd3c235ce8ef2be2b781023c467a45108be8e5bb4beea25dfe6f_norm / (1.0 * num_cores);
}

// name: GPU Last Level Cache Utilization
// description: GPU last level cache utilization
// type: Percentage
function L2CacheUtilization()
{    
    return _5c5c55d05fb355aa5be61ac63c88eb4a2a521a47dd8f79c18b5c1df163d5cb55_norm / (4.0 * num_mgpus);
}

// name: Partial Renders Count
// description: Count number of partial renders in the encoder
// type: Count
function PartialRenders()
{
    return _899b43f77bed0cc43134b61fcccca0925a0e62110b4bb7fae2c765efa3f9bbdc;
}

// name: Parameter Buffer Tiler Alloc
// description: Parameter Buffer Tiler Alloc
// type: Count
function ParameterBufferTilerAlloc()
{
    return _257ec906bdb46e45679882d962be91fe1c161cb79df17ea71a7427b234a0b812 * 32 * 1024;
}

// name: Parameter Buffer Primitive Block Alloc
// description: Parameter Buffer Primitive Block Alloc
// type: Count
function ParameterBufferPrimitiveBlockAlloc()
{
    return _23628149970030e181bfc592d170355b20bf26530773c5dc9481760b2c4158ea * 32 * 1024;
}

// name: Parameter Buffer Bytes Used
// description: Parameter Buffer Bytes Used
// type: Count
function ParameterBufferBytesUsed()
{
    return ParameterBufferTilerAlloc() + ParameterBufferPrimitiveBlockAlloc();
}

// name: Frag Ticks Count
// description: Frag Tick for limiters
// type: Value
function FRGTicks()
{    
    return _06f73dd77cc4f21054a372b34a28a1d5d054ff7241ee73be67f927d897211048;
}

// name: Comprehensive Fragment Input Interpolation Limiter
// description: Comprehensive Fragment Input Interpolation limiter
// type: Percentage
function ComprehensiveFragmentInputInterpolationLimiter()
{
    return Math.max(FragmentInputInterpolationLimiter(), Math.min((_81e94ff007a99cc84c59352583de71dad427a422d70be052cff38c6e018907ee_norm + _c1043a6e3112f17390996d9c7e6ccd58dd5e1fd64f7fb92fa4f59c07e569bf95_norm) / (1.0 * num_cores), 100.0));
}  

// name: Comprehensive Fragment Input Interpolation Utilization
// description: Comprehensive Fragment Input Interpolation Utilization
// type: Percentage
function ComprehensiveFragmentInputInterpolationUtilization()
{
    return Math.max(FragmentInputInterpolationUtilization(), Math.min(_81e94ff007a99cc84c59352583de71dad427a422d70be052cff38c6e018907ee_norm / (1.0 * num_cores), 100.0));
}  

// name: Texture Cache Limiter
// description: Texture cache limiter
// type: Percentage
function TextureCacheLimiter()
{
    return Math.min((_ad6b7a66022bb8efc6c01d6f3db0be8594408168905585015d8f7ab8e7efe672_norm) / (8.0 * num_cores), 100.0);
}  

// name: Texture Cache Miss Limiter
// description: Texture cache miss limiter
// type: Percentage
function TextureCacheMissLimiter()
{
    return Math.min((_2fab6f6232fd4f1349620047490c7562c852746134f1a6e53ca0510462394598_norm + _f4035ec10b022c926c9e5a14e4e2c08c16049d0e9474bf8b383ed109db7360d7_norm) / (num_cores), 100.0);
}  

// name: Sparse Texture Translation Limiter
// description: Sparse texture address translation limiter
// type: Percentage
function SparseTextureTranslationLimiter()
{
    return Math.min(Math.max(_1308feee43a7aae19c3764eb8928e79f464f3a2b9d1291b01c1bae25565fa93c_norm + _ee24ab3d92c84359c20d00d2061a37fcec736e1c550577f0529a9c9441a265dc_norm, _adcaa1bfdaea7d31b4a776ffd13089ba401d5c9c533c77378b5f378062215fdb_norm + _883c062d224c59ccd4c4303a7caeacbd0aa87cd6fffd5347dfedb52a23f4a6e5_norm) / (num_cores), 100.0);
}

// name: Number of Sparse Texture Requests
// description: Sparse texture requests
// type: Value
function SparseTextureRequests()
{
    return _d2acb8217628c8c28df030d3f819e3831a16760dc5af79722487d789d9cbe02d + _847829852334f2b320f2b2890d9a9c3dd7022b760b29a94540ba4fe13d1dd91a + _a7dd90063ddd29bf1b2d1259297cca0904b949cc92e9dee2e929fec2294f0422;
}

// name: Average Sparse Texture Request Size
// description: Average Sparse Texture Request Size in KB
// type: Rate
function AverageSparseTextureRequestSize()
{
    return 16.0*(_d2acb8217628c8c28df030d3f819e3831a16760dc5af79722487d789d9cbe02d + 4.0*_847829852334f2b320f2b2890d9a9c3dd7022b760b29a94540ba4fe13d1dd91a + 16.0*_a7dd90063ddd29bf1b2d1259297cca0904b949cc92e9dee2e929fec2294f0422) / Math.max(SparseTextureRequests(), 1.0);
}

// name: Fragment Generator Primitive Utilization
// description: Fragment generator primitive processing utilization
// type: Percentage
function FragmentGeneratorPrimitiveUtilization()
{
    return (_64a10cb112e74a4ec02f177b245e3f83edd61c0f78bc5bc7ae4978ce28f07f83_norm) / (0.25 * num_cores);
}  

// name: Fragment Rasterizer Utilization
// description: Fragment Rasterizer utilization
// type: Percentage
function FragmentRasterizerUtilization()
{
    var msaa = 2.0 * _aabc9758d4e52fd36dfb1a0e38171798aa7bf2ec665135dc298c1aa1a7c10760_frg / Math.max(_7cef4e481233623472ea3e1f6b4131fabb20f247f7e5eae173dfd693aa60d0ff_frg, 1.0);
    if (msaa > 1.1)
    {
        return Math.min((_aabc9758d4e52fd36dfb1a0e38171798aa7bf2ec665135dc298c1aa1a7c10760_norm_frg) / (num_cores), 100.0);
    }
    return Math.min((2.0 * _aabc9758d4e52fd36dfb1a0e38171798aa7bf2ec665135dc298c1aa1a7c10760_norm_frg) / (num_cores), 100.0);
}

// name: Fragment Quad Processor Utilization
// description: Fragment quad processor utilization
// type: Percentage
function FragmentQuadProcessingUtilization()
{
    return Math.min((4.0 * _ca0d54323c1777d994357aaacdb7beac572bea11cd16afed4c756f3dc9496a18_norm_frg) / (2.0 * num_cores), 100.0);
}

// name: Fragment Primitives Processed
// description: Fragment quad processed
// type: Percentage
function FragmentGeneratorPrimitives()
{
    return _64a10cb112e74a4ec02f177b245e3f83edd61c0f78bc5bc7ae4978ce28f07f83_frg;
}  

// name: Fragment Quad Processed
// description: Fragment quad processed
// type: Percentage
function FragmentQuadProcessed()
{
    return 4.0 * _ca0d54323c1777d994357aaacdb7beac572bea11cd16afed4c756f3dc9496a18_frg;
}  

// name: Pre Culling Primitive Block Utilization
// description: Pre Culling primitive block utilization
// type: Percentage
function PreCullPrimitiveBlockUtilization()
{
    return Math.min(_46210435e8bd691719dc45391f51ef552bf7e745c1401ee9943aa6f85086336e_norm_vtx / (0.5 * num_gps), 100.0);
}

// name: Pre Culling Primitive Count
// description: Pre Culling primitive count
// type: Percentage
function PreCullPrimitiveCount()
{
    return _46210435e8bd691719dc45391f51ef552bf7e745c1401ee9943aa6f85086336e_vtx;
}

// name: Post Clipping Culling Primitive Block Utilization
// description: Post Clipping Culling primitive block utilization
// type: Percentage
function PostClipCullPrimitiveBlockUtilization()
{
    return Math.min(_2d3c257f33af88b8488658fb5b6a86f64cb02169b680e1250d3f37d373a4197f_norm_vtx / (num_gps), 100.0);
}

// name: Primitive Tile Intersection Utilization
// description: Primitive tile intersection utilization
// type: Percentage
function PrimitiveTileIntersectionUtilization()
{
    return Math.min(_149b69750a3c80a27d163a4ca69ec03e3b39b3c0afe9c90c8cd37a128832cb13_norm_vtx / (num_gps), 100.0);
}

// name: Tiler Utilization
// description: Tiling block utilization
// type: Percentage
function TilerUtilization()
{
    return Math.min(_da824fe9269c1efd80cb71a6e5415be160b6f43b41e858cb83976c4140b052a5_norm_vtx / (num_gps), 100.0);
}

// name: MMU Limiter
// description: Measures the time during which GPU is attempting to execute read and write requests through MMU due to last level cache misses as a percentage of peak MMU performance
// type: Percentage
function MMULimiter()
{
    return Math.min((_6d6a7c8efb15986fa71f8bf4a6a06f8942199b36680e516766e92490607c958d_norm + _fdc48a2370f6885da6ac169661812057de2cf71fbbbcb5df8348a78f112992dc_norm) / (4.0 * num_mgpus), 100.0);
}

// name: MMU Utilization
// description: Measures the time during which GPU performs read and write requests through MMU due to last level cache misses as a percentage of peak MMU performance
// type: Percentage
function MMUUtilization()
{
    return Math.min((_6d6a7c8efb15986fa71f8bf4a6a06f8942199b36680e516766e92490607c958d_norm) / (4.0 * num_mgpus), 100.0);
}

// name: GPU to main memory bidirectional traffic in bytes
// description: GPU to main memory bidirectional traffic in bytes
// type: Value
function MainMemoryTraffic()
{
    return 64.0 * _6d6a7c8efb15986fa71f8bf4a6a06f8942199b36680e516766e92490607c958d;
}

// name: VS Invocation Unit Utilization
// description: VS invocation unit utilization
// type: Percentage
function VSInvocationUtilization()
{
    return Math.min(_da2d5f5fd43e7edda6d5635752a29f09d285cf47c2ecd0a1b83b1ba3eddcef55_norm_vtx / (0.5 * num_gps), 100.0);
}

// name: Fragment Z Store Unit Utilization
// description: Fragment Z store unit utilization
// type: Percentage
function FragmentZStoreUtilization()
{
    return Math.min((_63b721bdb7ff9f45f3835f7e6a8a4595b1fed0038ae9a76cb853fc36756386c9_norm_frg) / num_cores, 100.0);
}  

// name: Fragment Z Store Unit Bytes Written
// description: Fragment Z store unit bytes written
// type: Value
function FragmentZStoreBytes()
{
    return _63b721bdb7ff9f45f3835f7e6a8a4595b1fed0038ae9a76cb853fc36756386c9 * 32;
}  

// name: Z Main Memory Bytes Written
// description: Total bytes written for textures to main memory
// type: Value
function ZBytesWrittenToMainMemory()
{                
    return 64.0 * (_513d287e274b210e0367b2abc7ef2608b0059fb5a6acf749144343586fe1c637 + _38ac6faf9eaef3f9faf843a65ce0c1f445989a19ba86e9386abeca4e0e01cf3d) + 128.0 * (_4e90e2533a170479afd8d0b83a68177595b7245bf4ab6e20096a9e0c0529012e + _6d4821165f0bbae1363beb8117b91295a3ffad188a87aa55b06b10f7370fca85);
}

// name: Compression Ratio of Z Texture Memory Written
// description: Ratio of compressed to uncomressed depth/stencil texture memory written
// type: Rate
function CompressionRatioZTextureMemoryWritten()
{    
    return FragmentZStoreBytes() / Math.max(ZBytesWrittenToMainMemory(), 1);
}

// name: Fragment Generator Primitive Processed
// description: Fragment generator primitive processed
// type: Value
function FragmentGeneratorPrimitiveProcessed()
{
    return _64a10cb112e74a4ec02f177b245e3f83edd61c0f78bc5bc7ae4978ce28f07f83;
}

// name: Fragment Quads Processed
// description: Fragment generated quads processed
// type: Value
function FragmentQuadsProcessed()
{
    return 4.0 * _ca0d54323c1777d994357aaacdb7beac572bea11cd16afed4c756f3dc9496a18_frg;
}    

// name: Pre Culling Primitive Count
// description: Pre Culling primitive count
// type: Value
function PreCullPrimitiveCount()
{
    return _46210435e8bd691719dc45391f51ef552bf7e745c1401ee9943aa6f85086336e_vtx;
}

// name: Fragment Bytes Written
// description: Fragment bytes written
// type: Value
function FragmentStoreBytes()
{
    return 4.0*(_60b74ec0e06a7b2279ca3c1131155a13c4a5b231d1e5d98a55a0990939e88168 + 2.0*_9290d4f55ee82ba67532c0cd99b14ce8e3cc547e714255c25f52f81ad7050ab2 + 4.0*_4e9aebe595eff4fd33ee46fa2962bd3955adb83eb002404513ce342f8cfca446 + 8.0*_893ab5dd2699dd85fb9a6332f8bf65d8ca8b3cfe21c74531833f012637d9694b + 16.0*_afb0184e960da27de79a4a2c74fcee8a7eab380f37462d19d027b357c8005eae);
}  

// name: Primitive Tile Intersections
// description: Primitive tile intersections
// type: Value
function PrimitiveTileIntersections()
{
    return _149b69750a3c80a27d163a4ca69ec03e3b39b3c0afe9c90c8cd37a128832cb13_vtx;
}

// name: Tiles Processed in Tiler
// description: Tiles processed by tiling block
// type: Value
function TilerTilesProcessed()
{
    return _da824fe9269c1efd80cb71a6e5415be160b6f43b41e858cb83976c4140b052a5_vtx;
}

// name: Fragment Generator Tiles Processed
// description: Fragment Generator Tiles Processed
// type: Value
function FragmentGeneratorTilesProcessed()
{
    return _eda5bce70befa39e7c6029505c0269211092c220048a502fd8fa2fe30895465b;
}

// name: Texture Cache Read Misses
// description: Texture cache miss count
// type: Value
function TextureCacheMissCount()
{
    return _2fab6f6232fd4f1349620047490c7562c852746134f1a6e53ca0510462394598;
}

// name: Depth Stencil Texture Main Memory Bytes Read
// description: Total bytes read for depth / stencil textures from main memory
// type: Value
function ZTextureBytesReadFromMainMemory()
{
    return 64.0 * (_71b7e9060085fee2d685ddb1202c79855cb96962ceb1328f9b5a993944ef2800 + _4f09bffac0ab5e557c43c129b54a4ea67269654b4cd033eccf3120127543505c);
}

// name: Fragment Z Unit Bytes Read
// description: Fragment Z unit bytes read
// type: Value
function FragmentZLoadBytes()
{
    return _40680272e25f5a98ef1fdae57c0be82cc7fb940000907f1a4d46547de8525db0 * 64;
}  

// name: Fragment Interpolation Instructions
// description: Fragment interpolation instructions
// type: Value
function FragmentInterpolationInstructions()
{
    return 32 * (_81e94ff007a99cc84c59352583de71dad427a422d70be052cff38c6e018907ee + _95b5e692e6eefd3c235ce8ef2be2b781023c467a45108be8e5bb4beea25dfe6f);
}  

// name: ALU FP32 Instructions Executed
// description: ALU FP32 Instructions executed
// type: Value
function ALUF32()
{
    return (_8e70441b8b0d9ded3ed900ec761f9f5960b106c5a304b44d62781621d5d1861a * 16);
}

// name: ALU FP16 Instructions Executed
// description: CS ALU FP16 Instructions executed
// type: Value
function ALUF16()
{
    return (_82b2f93079459b00fb869444cfcf44604cc1a91d28078cd6bfd7bb6ea6ba423d * 16);
}

// name: ALU 32-bit Integer and Conditional Instructions Executed
// description: ALU Select, Conditional, 32-bit Integer and Boolean Instructions executed
// type: Value
function ALUInt32AndCond()
{
    return (_23c51175314006fa4b6798dcb173a814349e2e5947244cfdba868be736d2bc03 * 16);
}

// name: ALU Integer and Complex Instructions Executed
// description: ALU Integer and Complex Instructions executed
// type: Value
function ALUIntAndComplex()
{
    return (_827783963eafa9275a53fc2b3ef13214ab90939fcc81572c4260e2eac9bd2acb * 16);
}

// name: ALU FP32 Instructions Issued
// description: ALU FP32 Instructions issued
// type: Value
function ALUF32Issued()
{
    return (_a6e6cc683eebf697b2a31bd7d4f877afee2419f6882f55b2f4ea296c9a368b99 * 128);
}

// name: ALU FP16 Instructions Issued
// description: CS ALU FP16 Instructions issued
// type: Value
function ALUF16Issued()
{
    return (_0af59bb3dd0a90f2664cd5e5601b3c56bf91e40478def55647411007dc5394d3 * 128);
}

// name: ALU 32-bit Integer and Conditional Instructions Issued
// description: ALU Select, Conditional, 32-bit Integer and Boolean Instructions issued
// type: Value
function ALUInt32AndCondIssued()
{
    return (_4ffbecab1c5697bfb927de016f6ddd4b010ddb0588049be5243c148e62d21409 * 128);
}

// name: ALU Integer and Complex Instructions Issued
// description: ALU Integer and Complex Instructions issued
// type: Value
function ALUIntAndComplexIssued()
{
    return (_04ec68f75ab42cefa364623ffb059b101b9d6d35ed0e59abbbc94170b4ec6cbe * 128);
}

// name: Fragment Generator Primitive Processed Per Tile
// description: Fragment generator primitive processed per tile
// type: Rate
function AveragePrimitiveProcessedPerTile()
{
    return FragmentGeneratorPrimitiveProcessed() / FragmentGeneratorTilesProcessed();
}

// name: Average Varyings Per Fragment
// description: Average varyings per fragment
// type: Rate
function AverageVaryingsPerFragment()
{
    return 32.0 * _8591ca442644d4dbcf7f4b5f583dc5bfe7417cee2eb2c1b0186997681c7a7674 / PSInvocation();
}

// name: Opaque Fragment Quads Processed
// description: Percentage of opaque quads processed out of total quads
// type: Percentage
function OpaqueFragmentQuadsProcessed()
{
    return Math.min(100.0 * 4.0 * _719a713b390f2b37bbbe8ca62f3053819539a3fc60d05b02f21b2c8435fb73a6 / Math.max(FragmentQuadsProcessed(), 1.0), 100.0);
}

// name: Translucent Fragment Quads Processed
// description: Percentage of translucent quads processed out of total quads
// type: Percentage
function TranslucentFragmentQuadsProcessed()
{
    return Math.min(100.0 * 4.0 * _fade8eea03e1fbf9a3d3cd6ab6bfd82b70bc1595ffb23f1b638746baa6c672e0 / Math.max(FragmentQuadsProcessed(), 1.0), 100.0);
}

// name: Feedback Fragment Quads Processed
// description: Percentage of feedback quads processed out of total quads
// type: Percentage
function FeedBackFragmentQuadsProcessed()
{
    return Math.min(100.0 * 4.0 * (_db1f507c85a72a4148283a69481d823edb23fbfb999acf18fb2d155eb7edc768 + _879d7622b5c9023712d7cc6c70f432757ab72505afba79be4dcb023459f9658a) / Math.max(FragmentQuadsProcessed(), 1.0), 100.0);
}

// name: Texture Filtering Limiter
// description: Measures the time during which texture filtering is attempted to execute as a percentage of peak texture filtering performance.
// type: Percentage
function TextureFilteringLimiter()
{    
    return (_7c42e99464b33ee51de11bdd9f8cf11a14473f7061e75f7589a3578a7757abfd_norm) / (8.0 * num_cores);
}

// name: Texture Filtering Utilization
// description: Texture filtering utilization
// type: Percentage
function TextureFilteringUtilization()
{
    return _d11d0ca656849a8048dbe7d1d6761d3cbcf463d9196a20b3da7e6a554fd0652f_norm / (8.0 * num_cores);    
}

// name: Texture Cache Utilization
// description: Texture cache utilization
// type: Percentage
function TextureCacheUtilization()
{
    return Math.min(_d54a22a6f6eb41ec901489f9e47263886645d322e2546360a6622d2c6bdeddb9_norm / (8.0 * num_cores), 100.0);
} 

// name: Tiling Block Limiter
// description: Measures the time during which tiling block is busy processing primitive tile intersections as a percentage of peak tiling block performance.
// type: Percentage
function TilingBlockLimiter()
{
    return Math.min((_f883d72b08be21c3348078baaa2362bec3884949a1726642308e7dd5cb69fe07_norm_vtx + _a15872ac9b60de1aa5b2f8738fe49df926f782ead2f5f010124e3c141c961be3_norm_vtx) / num_gps, 100.0);
}

// name: Primitive Blocks Write Limiter
// description: Measures the time during which primitive blocks are written to memory as a percentage of peak primitive block memory write performance.
// type: Percentage
function PrimitiveBlocksWriteLimiter()
{
    return Math.min((_2413cbfc3cf49db0f8a6cbaddb7f99118134a04d0a7bbfcf3e5c192276c68644_norm_vtx + _27cde4b049e15693c767899196a213dcd807878d655e33dde43ddff8910df32e_norm_vtx) / num_gps, 100.0);
}

// name: Shaded Vertex Read Limiter
// description: Measures the time during which shaded vertices from vertex shader are read by primitive processing block as a percentage of peak shaded vertices read performance
// type: Percentage
function ShadedVertexReadLimiter()
{
    return Math.min((_ffb81bec9c1a43cfe9f952f38103d1887bef653181bcb3c1362308492368933d_norm_vtx + _50c5ccf70ef1ec17254253a456f052e1130edd339eee1dafe34fc8254d36b52a_norm_vtx) / num_gps, 100.0);
}

// name: Primitive Culling Limiter
// description: Measures the time during which primitives are culled in cull unit as a percentage of peak primitive culling performance of cull unit
// type: Percentage
function PrimitiveCullLimiter()
{
    return Math.min((_c3bf601f0a951d8e293718574d5f9ce5ddcb27d830ef81f6b018a3b933194ce1_norm_vtx) / num_gps, 100.0);
}


// name: Primitive Clip Limiter
// description: Measures the time during which primitives are clipped in clip unit as a percentage of peak primitive clip performance
// type: Percentage
function PrimitiveClipLimiter()
{
    return Math.min((_ba42c3f46d52663d076f226bfb30be092b4b536d27d161d16869c10288811903_norm_vtx) / num_gps, 100.0);
}

// name: MMU TLB Requests
// description: MMU TLB Requests
// type: Count
function MMUTLBRequests()
{
    return _f979050bb2025db30472553358915cf6b8e4c2c0ed3560eb7b5c198dbbe4b81b + _149a3fd59233506993ae495b10f06a96ebc758ca2d48f28bf4220075da387605 + _f0acaa90d3defbe7f7592422031c90f973ddb499ed011216ba3cc09eb212b7f8 + _7aa31203466486f27bb96d0ebd90868e682095da42c4034d6cda84d5748cecda;
}

// name: MMU TLB Hits
// description: MMU TLB Hits
// type: Count
function MMUTLBHits()
{
    return _9a33e518806a7e8225f36d984fd261d35f1f9a349eb0dd7583e700fe16583d3c + _2d07becdbb96d87ab192b1784a0078b2b892fa8545d2d56480cc48736535b217 + _db22670d2346fd08146c41953c89c735e4966799b5d09565f61cecf15fdbca49 + _d5c70b6ea517f2adbf0e9af3f525d8e164843e1018a521a217215736eb2a49ab;
}

// name: MMU TLB Miss Rate
// description: MMU TLB misses expressed as a percentage of total MMU TLB requests. Large values may be due to random memory access pattern
// type: Percentage
function MMUTLBMissRate()
{
    var totalRequests = MMUTLBRequests();
    return Math.min(100.0 * (totalRequests - MMUTLBHits()) / Math.max(totalRequests, 1.0), 100.0);
}

// name: Miss Buffer Full Stall Ratio
// description: Ratio of stalls caused by miss buffer fulls to MMU stalls
// type: Rate
function MissBufferFullStallRatio()
{
    if (_fdc48a2370f6885da6ac169661812057de2cf71fbbbcb5df8348a78f112992dc > 0)
    {
        return Math.min(_dff27335f3b4725d1079262c0756715e9a7103f39e2da164f31eaa03be1426e8 / Math.max(_fdc48a2370f6885da6ac169661812057de2cf71fbbbcb5df8348a78f112992dc, 1.0), 1.0);
    }
    return 0;
}

// name: Rasterized Fragments Per Triangle
// description: Number of fragments rasterized per triangle submitted
// type: Rate
function RasterizedFragmentsPerTriangle()
{
    return FragmentsRasterized() / Math.max(PrimitivesSubmitted(), 1.0);
}
