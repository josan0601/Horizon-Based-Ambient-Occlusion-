#version 400

uniform sampler2D Pos;
uniform sampler2D Normal;
uniform sampler2D Color;

layout (location = 0) out vec4 FragColor;
layout (location = 1) out vec4 BrightColor;

uniform vec3 CamPos;
uniform vec3 LightPos;
uniform vec3 LightColor;
uniform float Radius;

in vec3 SpherePos;


void main()
{
    vec2 UV = vec2(gl_FragCoord.x / 1280, gl_FragCoord.y / 720);
    // Read data from G-Buffer
    vec4 diffTexValue = texture(Color, UV);
    vec4 posTexValue = texture(Pos, UV);
    vec4 normalTexValue = texture(Normal, UV);

    // Get values from data
    vec3 diffuse = diffTexValue.rgb;
    float specular = diffTexValue.a;
    vec3 posvec = posTexValue.rgb;
    float Depth = posTexValue.a;
    vec3 normal = normalize(normalTexValue.rgb);
    float Shininess = normalTexValue.a;

    // Compute lighting with the data from G-Buffer and store in final output
    vec3 lighting = diffuse * 0.f;
    vec3 viewDir = normalize(CamPos - posvec);

    vec3 lightDir = normalize(LightPos - posvec); // ***********
    vec3 diffuseComp =  diffuse * LightColor * max(dot(normal, lightDir), 0.0);
    float specAmount = pow(max(dot(viewDir, reflect(-lightDir, normal)), 0.0f), Shininess) * specular;

    float att = 1 - min(length(LightPos - posvec) / Radius, 1);

    lighting = att * (diffuseComp + vec3(specAmount, specAmount, specAmount));



    FragColor += vec4(lighting, 1.0f);

    float brightness = dot(FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));

    if(brightness > 1.0)
        BrightColor = vec4(FragColor.rgb, 1.0);
    else
        BrightColor = vec4(0.0, 0.0, 0.0, 1.0);
    
}