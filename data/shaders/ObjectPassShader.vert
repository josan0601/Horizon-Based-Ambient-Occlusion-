#version 400

layout(location = 0) in vec3 vPosition;
layout(location = 1) in vec3 vNormal;
layout(location = 2) in vec2 vTextCoords;
layout(location = 3) in vec4 vTangent;

uniform mat4 Perspective;
uniform mat4 Model;
uniform mat4 View;

out vec3 Normal;
out vec2 TexCoords;
out vec3 FragPos;
out vec3 Tangent;
out vec3 BiTangent;

void main()
{   

   TexCoords = vTextCoords;
   vec4 TempVec4 = vec4(vPosition, 1.0);
   
   FragPos = (View * Model * TempVec4).xyz;
   Normal = normalize((mat3(View * Model)) * vNormal);
   Tangent = normalize((mat3(View * Model)) * vec3(vTangent));
   BiTangent = normalize((mat3(View * Model)) * (cross(vNormal, vec3(vTangent)) * vTangent.w));

   gl_Position = Perspective * View * Model * TempVec4; 

}