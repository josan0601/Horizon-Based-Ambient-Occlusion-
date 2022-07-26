#version 400

uniform sampler2D PosTex;

uniform float RadiusScale;
uniform float AngleBias;
uniform int NumberOfDirections;
uniform int NumberOfSteps;
uniform float AttenuationAO;
uniform float ScaleAO;

uniform mat4 Projection;

float Pi = 3.1415926535897932384626433832795f;

layout (location = 0) out vec4 FragColor;

//in vec2 UV;
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()
{
    vec2 UV = vec2(gl_FragCoord.x / 1280, gl_FragCoord.y / 720);
    // Read data from G-Buffer
    vec4 Pos4 = texture(PosTex, UV);
    vec3 PosView = Pos4.rgb;

    float AngleInc = (2.f * Pi) / NumberOfDirections;
    float StepInc = RadiusScale / NumberOfSteps;

    float InitAngle = mod(random(UV), (2.f * Pi));

    vec3 dx = normalize(dFdx(PosView));
    vec3 dy = normalize(dFdy(PosView));

    float AO = 0;

    for(int i = 0;i < NumberOfDirections;i++)
    {
        
        vec3 maxHorizonVec = vec3(0);
        float maxHorizonAngle = 0.0f;
        vec3 Tangent = normalize(dx * cos(InitAngle + i * AngleInc) + dy * sin(InitAngle + i * AngleInc));

        vec2 SamplingDir = normalize(vec2(cos(InitAngle + i * AngleInc), sin(InitAngle + i * AngleInc)));


        for(int j = 0;j < NumberOfSteps;j++)
        {
            // Get stepped position and its UV
            vec3 NewPos = PosView + vec3(SamplingDir * (StepInc * (j + 1)), 0);
            vec4 ProjectedPos = Projection * vec4(NewPos, 1.f);
            ProjectedPos /= ProjectedPos.w;
            
            // Make them from -1 to 1 range to 0 to 1 range
            vec2 ProjectedUV = (ProjectedPos.xy + vec2(1, 1)) / 2;

            // Get position with new UV
            vec3 StepPos = texture(PosTex, ProjectedUV).rgb;

            vec3 HorizonVec = StepPos - PosView;
            if(HorizonVec == vec3(0))
            continue;

            vec3 normal = cross(dx, dy);
            //float HorizonAngle = (3.141592f / 2.0) - acos(dot(normal, normalize(HorizonVec)));
            float HorizonAngle = atan(HorizonVec.z / length(HorizonVec.xy));
            if(maxHorizonAngle < HorizonAngle && length(HorizonVec) < RadiusScale)
            {
                maxHorizonAngle = HorizonAngle;
                maxHorizonVec = HorizonVec;
            }

        }
        float TangentAngle = atan(Tangent.z / length(Tangent.xy));
        
        //FragColor = vec4(vec3(maxHorizonVec), 1);
        //
        //if(i == 2)
        //    return;

        if(maxHorizonAngle == 0)
        continue;

        float Att = 1.0f - pow(length(maxHorizonVec) / RadiusScale, 2);

        float NewAO = sin(maxHorizonAngle) - sin(TangentAngle + AngleBias);
        //FragColor = vec4(vec3(NewAO), 1);
    
        AO += Att * NewAO * AttenuationAO;
        //AO += NewAO;
    }

    AO /= NumberOfDirections;

    FragColor = vec4(vec3(pow(1 - AO , ScaleAO)), 1.0f);
    //FragColor = vec4(vec3(TangentAngle), 1);
}