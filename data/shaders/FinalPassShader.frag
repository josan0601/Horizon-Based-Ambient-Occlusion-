#version 400

out vec4 FragColor;
  
in vec2 UV;

uniform sampler2D scene;
uniform sampler2D bloomBlur;
uniform bool UseBloom;
uniform bool SpecularMode;
uniform bool DepthMode;

void main()
{           
    //float exposure = 1.0;
    //const float gamma = 2.2;
    vec3 hdrColor;
    
    if(SpecularMode || DepthMode)
        hdrColor = vec3(texture(scene, UV).a);
    else 
        hdrColor = texture(scene, UV).rgb;      

    vec3 bloomColor = texture(bloomBlur, UV).rgb;
    //hdrColor += bloomColor; // additive blending
    // tone mapping
    //vec3 result = vec3(1.0) - exp(-hdrColor * exposure);
    // also gamma correct while we're at it       
    //result = pow(result, vec3(1.0 / gamma));
    if(UseBloom)
        FragColor = vec4(hdrColor +  bloomColor, 1.0);
    else
        FragColor = vec4(hdrColor, 1.0);
}  