#version 400

layout (location = 0) out vec4 gPosition;
layout (location = 1) out vec4 gNormal;
layout (location = 2) out vec4 gAlbedoSpec;

in vec2 TexCoords;
in vec3 FragPos;
in vec3 Normal;
in vec3 Tangent;
in vec3 BiTangent;

uniform vec4 Color;
uniform bool UseTex;
uniform bool UseNormalMap;
uniform bool UseMetalic;
uniform float MetalicFactor;

uniform sampler2D ColorTexture;
uniform sampler2D NormalTexture;
uniform sampler2D MetalicTexture;

void main()
{    
    vec3 metalic;

    if(!UseMetalic)
        metalic = vec3(MetalicFactor, MetalicFactor, MetalicFactor);
    else      
        metalic = texture(MetalicTexture, TexCoords).rgb;
    
    if(metalic.g == 0)
        metalic.g = 0.01;
    // store the fragment position vector in the first gbuffer texture
    gPosition = vec4(FragPos, gl_FragCoord.z);
    // also store the per-fragment normals into the gbuffer
    if(UseTex)
        gAlbedoSpec = vec4(texture(ColorTexture, TexCoords).rgb, metalic.b);
    else
        gAlbedoSpec = vec4(Color.rgb, metalic.b);


    //if(UseTex)
    if(UseNormalMap)
    {   
        gNormal = vec4(mat3(Tangent, BiTangent, Normal) * (texture(NormalTexture, TexCoords, 1).rgb * 2.0 - 1.0), metalic.g);
    }else 
        gNormal = vec4(normalize(Normal), metalic.g);
    //else
    //    gAlbedoSpec = Color;
}  
