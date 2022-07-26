#version 400

uniform sampler2D Color;
uniform sampler2D AO;

layout (location = 0) out vec4 FragColor;

//in vec2UV;
uniform float Ambient;
uniform bool UseAO;

void main()
{
    vec2 UV = vec2(gl_FragCoord.x / 1280, gl_FragCoord.y / 720);
    // Read data from G-Buffer
    vec4 diffTexValue = texture(Color, UV);

    // Get values from data
    vec3 diffuse = diffTexValue.rgb;

    if(UseAO)
    {
        FragColor = vec4(Ambient * diffuse * texture(AO, UV).rgb, 1.0f);

    }else
        FragColor = vec4(Ambient * diffuse, 1.0f);
    
}