//픽셀의 위치에 따라 색상을 다르게 주기위함

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

//Math가 없음, 큰데이터를 처리하기 위해서 GLSL안에서 연산
const vShaderSource = ` 
    attribute vec2 position;
    attribute vec4 color;
    #define M_PI 3.1415926535897932384626433832795;
    uniform vec2 resolution;

    varying vec4 vColor;

    void main(){
        vec2 transformedPosition = position/resolution*2.0 -1.0;
        gl_PointSize = 2.0;
        gl_Position = vec4(transformedPosition,0,1);

        vColor = color;
    }
`; // pass point coordinate

//소숫점 반올림여부 포함
const fShaderSource = `
    precision mediump float;
    varying vec4 vColor;

    void main(){
        gl_FragColor = vColor/255.0;
    }
`;

function compileShader(shader, source) {
    gl.shaderSource(shader, source); //connect
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader)
    if (log) throw new Error(log);
}

compileShader(vertexShader, vShaderSource);
// 각 픽셀마다 프래그먼트 쉐이더를 호출하여 당신이 픽셀을 무슨 색상으로 그리기 원하는지 물어 봅니다. 프래그먼트 쉐이더는 해당 픽셀에 대해 원하는 색상을 vec4로 출력합니다.
compileShader(fragmentShader, fShaderSource);

//셰이더 프로그램 그릇에 컴파일 된 두 셰이더를 담는다.
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program); //컴파일 된 두 셰이더를 링크한다.링크할 때 버텍스 셰이더의 varying 변수와 프래그먼트 셰이더의 varying 변수가 연결된다.
gl.useProgram(program); // gpu 한테 이 프로그램 사용한다고 말함

// 접근할 수 있는 위치값(포인터)을 GPU한테 시켜서 받아온다. 초기화과정에서 해야하는 일
//Attributes는 버퍼에서 데이터를 가져오기 때문에 버퍼를 생성해야 합니다.
const positionLocation = gl.getAttribLocation(program, 'position');
const colorLocation = gl.getAttribLocation(program, 'color');
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

// assigns a number to a float uniform...
gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]); // CASE 2

// CASE 3. TRIANGLES 
const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 6);
const colors = fillWithColors(6);

function createHexagon(centerX, centerY, radius, segmentsCount) {
    const vertices = [];
    const segmentAngle = Math.PI * 2 / (segmentsCount - 1);

    //https://i.stack.imgur.com/q0XR0.png
    for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
        const from = i;
        const to = i + segmentAngle;

        vertices.push(centerX, centerY);
        vertices.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
        vertices.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
    }
    return vertices;
}

function fillWithColors(segmentsCount) {
    const colors = [];
    for (let i = 0; i < segmentsCount; i++) {
        for (let j = 0; j < 3; j++) {
            if (j == 0) {
                colors.push(0, 0, 0, 255);
            } else {
                colors.push(i / 6 * 255, 0, 0, 255);
            }
        }
    }
    return colors;
}

//because of GPU accepts only typed arrays as input...
const positionData = new Float32Array(triangles) // CASE 3
const colorData = new Float32Array(colors);

// because of GPU should have it's own buffer ... 
const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER); //버퍼는 정점 및 기타 정점 관련 데이터를 GPU에 전달하는 방법입니다
const colorBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

//To make any changes to GPU buffer

//바인드 시 WEBGL의 내부 전역변수로 설정되어 모든 함수들이 참조 => 버퍼에 데이터를 넣을 수 있게 됨
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //생성된 버퍼를 작업할 버퍼로 지정합니다
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW); // 지정된 버퍼에 데이터를 전달

// 데이터가 버퍼에 들어간 후엔, WebGL에게 데이터를 가져오는 방법과 버텍스 쉐이더의 attribute로 제공하는 방법을 알려 주어야 합니다.

const attributeSize = 2; //정점당 얼마나 많은 컴포넌트를 가져오는지 알려줍니다(항상 1~4이어야 함, 셰이더에서 vec1 ~ vec4이므로)
const type = gl.FLOAT; //데이타의 타입은 무엇인지(BYTE, FLOAT, INT, UNSIGNED_SHORT등)를 알려줍니다
const nomaralized = false; //입력되는 데이터를 정규화를 할 것인가 결정,  true로 설정하면 BYTE(-128 ~ 127 범위)의 값이 -1.0 ~ +1.0 으로 정규화, 색상지정시 용량절약
const stride = 0; //하나의 데이터 조각에서 다음 데이타 조각을 가져오기 위해 건너 뛸 바이트 수, 0이면 데이터 타입과 크기에 맞게 자동으로 데이터를 가져옴
const offset = 0; //버퍼의 어디서 부터 읽기 시작할지 설정

// 파라미터로 지정된 위치에 있는 attribute 변수를 활성화 한다. 활성화의 의미는 그릴 때 이 attribute 변수의 내용을 사용하도록 한다는 의미
gl.enableVertexAttribArray(positionLocation)
// 애트리뷰트의 위치값을 이용해서 현재 gl.ARRAY_BUFFER라는 key에 바인딩 되어 있는 버퍼를 할당하도록 GPU에게 시킨다.
gl.vertexAttribPointer(positionLocation, attributeSize, type, nomaralized, stride, offset);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

gl.enableVertexAttribArray(colorLocation)
gl.vertexAttribPointer(colorLocation, 4, type, nomaralized, stride, offset);

gl.drawArrays(
    gl.TRIANGLES // 점,선,삼각형 중 어떤 걸 그리는지 알려줌
    , 0 // 어디다 그리는지 첫번쨰 인덱스 알려줌 
    , positionData.length / 2 // COUNT
);


