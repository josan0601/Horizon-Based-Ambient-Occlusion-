#version 400

layout(location = 0) in vec3 vPosition;
layout(location = 2) in vec2 vTexCoords;

out vec2 UV;

void main()
{

	gl_Position = vec4(vPosition * 2.0, 1.0);
	
	UV = vTexCoords;

}