import vShaderSource from './shaders/vertex.glsl';
import fShaderSource from './shaders/fragment.glsl';
import { createRect } from './shape-helpers';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
//gl.~~~()는 버스를 통해 GPU에게 무언가를 시키는 것이다.'라고 해석
//https://www2.cs.duke.edu/courses/compsci344/spring15/classwork/15_shading/gl-pipeline.png
const program = gl.createProgram(); //function == shaders == vertex + fragment

//쉐이더란 화면에 출력할 픽셀의 위치와 색상을 계산하는 함수, 농담, 색조, 명암 효과를 전부 짬뽕해서 나온 RGBA색상 값 하나
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

//main doesn't return anyhting, it assignes a value to a global variable gl_Position instead
// webgl은 0,0 이 중간


function compileShader(shader, source) {
    gl.shaderSource(shader, source); //connect
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader)
    if (log) throw new Error(log);
}

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

//셰이더 프로그램 그릇에 컴파일 된 두 셰이더를 담는다.
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program); //컴파일 된 두 셰이더를 링크한다.링크할 때 버텍스 셰이더의 varying 변수와 프래그먼트 셰이더의 varying 변수가 연결된다.
gl.useProgram(program); // gpu 한테 이 프로그램 사용한다고 말함

// 접근할 수 있는 위치값(포인터)을 GPU한테 시켜서 받아온다.
const positionLocation = gl.getAttribLocation(program, 'position');
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

// assigns a number to a float uniform...
gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]); // CASE 2

// CASE 3. TRIANGLES 
const triangles = createRect(0, 0, canvas.height, canvas.height);

//because of GPU accepts only typed arrays as input...
const positionData = new Float32Array(triangles) // CASE 3

// because of GPU should have it's own buffer ... 
const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER); //버퍼는 정점 및 기타 정점 관련 데이터를 GPU에 전달하는 방법입니다


//To make any changes to GPU buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //생성된 버퍼를 작업할 버퍼로 지정합니다
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW); // 지정된 버퍼에 데이터를 전달

const attributeSize = 2; //정점당 얼마나 많은 컴포넌트를 가져오는지 알려줍니다(항상 1~4이어야 함, 셰이더에서 vec1 ~ vec4이므로)
const type = gl.FLOAT; //데이타의 타입은 무엇인지(BYTE, FLOAT, INT, UNSIGNED_SHORT등)를 알려줍니다
const nomaralized = false; //입력되는 데이터를 정규화를 할 것인가 결정,  true로 설정하면 BYTE(-128 ~ 127 범위)의 값이 -1.0 ~ +1.0 으로 정규화, 색상지정시 용량절약
const stride = 0; //하나의 데이터 조각에서 다음 데이타 조각을 가져오기 위해 건너 뛸 바이트 수, 0이면 데이터 타입과 크기에 맞게 자동으로 데이터를 가져옴
const offset = 0; //버퍼의 어디서 부터 읽기 시작할지 설정

// 파라미터로 지정된 위치에 있는 attribute 변수를 활성화 한다. 활성화의 의미는 그릴 때 이 attribute 변수의 내용을 사용하도록 한다는 의미
gl.enableVertexAttribArray(positionLocation)
// 애트리뷰트의 위치값을 이용해서 현재 gl.ARRAY_BUFFER라는 key에 바인딩 되어 있는 버퍼를 할당하도록 GPU에게 시킨다.
gl.vertexAttribPointer(positionLocation, attributeSize, type, nomaralized, stride, offset);


gl.drawArrays(
    gl.TRIANGLES // 점,선,삼각형 중 어떤 걸 그리는지 알려줌
    , 0 // 어디다 그리는지 첫번쨰 인덱스 알려줌 
    , positionData.length / 2 // COUNT
);


