#version 400

layout(location = 0) in vec3 vPosition;
layout(location = 1) in vec3 vNormals;
layout(location = 2) in vec2 vTexCoords;

uniform mat4 MV;
uniform mat4 Perspective;

out vec3 SpherePos;

void main()
{

	gl_Position = Perspective * MV * vec4(vPosition, 1.0);
	
	SpherePos = vec4(MV * vec4(vPosition, 1.0)).rgb;

}