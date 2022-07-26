#version 400

out vec4 FragColor;
  
in vec2 UV;

uniform sampler2D image;
  
uniform float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

uniform float RangeSigma;
uniform float SpatialSigma;

float Pi = 3.1415926535897932384626433832795f;

// Paper where I found formulas for factor calculation
// http://people.csail.mit.edu/sparis/bf_course/course_notes.pdf

float FactorCalculationSpatial(float X)
{
    return (1 / (2 * Pi * SpatialSigma * SpatialSigma)) * exp(-( X * X / (2 * SpatialSigma * SpatialSigma) ));
}

float FactorCalculationRange(float X)
{
    return (1 / (2 * Pi * RangeSigma * RangeSigma)) * exp(-( X * X / (2 * RangeSigma * RangeSigma) ));
}

void main()
{             
    vec2 CurrCoordinates = gl_FragCoord.xy;
    vec3 Pixel = texture(image, UV).rgb;
    int PixelAmount = 3;
    vec2 tex_offset = 1.0 / textureSize(image, 0); // gets size of single texel
    
    vec3 FinalColor = vec3(0.0);

    float AverageFactor;

    for(int i = -PixelAmount;i <= PixelAmount;i++)
    {
        for(int j = -PixelAmount;j <= PixelAmount;j++)
        {
            vec2 CurrentUV =  UV + vec2(tex_offset.x * i, tex_offset.y * j);
            vec3 Current = texture(image, CurrentUV).rgb;
            float Factor = FactorCalculationSpatial(length(vec2(i, j))) * FactorCalculationRange(Pixel.r - Current.r);
            AverageFactor += Factor;
            FinalColor += Factor * Current;
        }

    }

    // Normalization step 
    FragColor = vec4(FinalColor / AverageFactor, 1.0);

}

//void main()
//{             
//    vec2 tex_offset = 1.0 / textureSize(image, 0); // gets size of single texel
//    vec3 result = texture(image, UV).rgb * weight[0]; // current fragment's contribution
//    if(horizontal)
//    {
//        for(int i = 1; i < 5; ++i)
//        {
//            result += texture(image, UV + vec2(tex_offset.x * i, 0.0)).rgb * weight[i];
//            result += texture(image, UV - vec2(tex_offset.x * i, 0.0)).rgb * weight[i];
//        }
//    }
//    else
//    {
//        for(int i = 1; i < 5; ++i)
//        {
//            result += texture(image, UV + vec2(0.0, tex_offset.y * i)).rgb * weight[i];
//            result += texture(image, UV - vec2(0.0, tex_offset.y * i)).rgb * weight[i];
//        }
//    }
//    FragColor = vec4(result, 1.0);
//}