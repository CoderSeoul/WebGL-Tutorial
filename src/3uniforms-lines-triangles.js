const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

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
    #define M_PI 3.1415926535897932384626433832795
    uniform float width;
    uniform vec2 resolution;

    void main(){
        float x = position.x/width*2.0-1.0;
        vec2 transformedPosition = position/resolution*2.0 -1.0;

        gl_PointSize = 2.0;
        
        gl_Position = vec4(x,cos(x*M_PI), 0, 1);
        gl_Position = vec4(transformedPosition,0,1);
    }
`; // pass point coordinate

//소숫점 반올림여부 포함
const fShaderSource = `
    precision mediump float;
    uniform vec4 color;

    void main(){
        gl_FragColor = vec4(1,0,0,1);
        gl_FragColor = color/255.0;
    }
`;

function compileShader(shader, source) {
    gl.shaderSource(shader, source); //connect
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader)
    if (log) throw new Error(log);
}

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

//connect with program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program); // 설정 후 병합
gl.useProgram(program); // gpu 한테 이 프로그램 사용한다고 말함

// 애트리뷰트의 위치
const positionPointer = gl.getAttribLocation(program, 'position');
const widthUniformLocation = gl.getUniformLocation(program, 'width');
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
const colorUniformLocation = gl.getUniformLocation(program, 'color');

// assigns a number to a float uniform...
// gl.uniform1f(widthUniformLocation,canvas.width); // CASE 1
// gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]); // CASE 2
gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255]);

//CASE 1. POINTS
const points = [];
for (let i = 0; i < canvas.width; i++) {
    //const x = i / canvas.width * 2 - 1; ransform value from [0..width] to [-1..1] =>
    points.push(i, i);
}

//CASE 2. LINES
const lines = [];
let prevLineY = 0;
for (let i = 0; i < canvas.width - 5; i += 5) {
    lines.push(i, prevLineY);
    const y = Math.random() * canvas.height;
    lines.push(i + 5, y);
    prevLineY = y;
}

// CASE 3. TRIANGLES 
const triangles = [
    0, 0,
    canvas.width / 2, canvas.height,
    canvas.width, 0
];

//because of GPU accepts only typed arrays as input...
// const positionData = new Float32Array(points) // CASE 1
// const positionData = new Float32Array(lines); // CASE 2
const positionData = new Float32Array(triangles) // CASE 3

// because of GPU should have it's own buffer ... 
const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER); //버퍼는 정점 및 기타 정점 관련 데이터를 GPU에 전달하는 방법입니다
//To make any changes to GPU buffers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //생성된 버퍼를 작업할 버퍼로 지정합니다
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW); // 지정된 버퍼에 데이터를 전달

const attributeSize = 2; //정점당 얼마나 많은 컴포넌트를 가져오는지 알려줍니다(항상 1~4이어야 함, 셰이더에서 vec1 ~ vec4이므로)
const type = gl.FLOAT; //데이타의 타입은 무엇인지(BYTE, FLOAT, INT, UNSIGNED_SHORT등)를 알려줍니다
const nomaralized = false; //입력되는 데이터를 정규화를 할 것인가 결정,  true로 설정하면 BYTE(-128 ~ 127 범위)의 값이 -1.0 ~ +1.0 으로 정규화, 색상지정시 용량절약
const stride = 0; //하나의 데이터 조각에서 다음 데이타 조각을 가져오기 위해 건너 뛸 바이트 수, 0이면 데이터 타입과 크기에 맞게 자동으로 데이터를 가져옴
const offset = 0; //버퍼의 어디서 부터 읽기 시작할지 설정

gl.enableVertexAttribArray(positionPointer)
// 애트리뷰트가 현재의 ARRAY_BUFFER의 바인드 포인트에서 데이터를 어떻게 가져올지 지시
gl.vertexAttribPointer(positionPointer, attributeSize, type, nomaralized, stride, offset);

gl.drawArrays(
    gl.TRIANGLES // 점,선,삼각형 중 어떤 걸 그리는지 알려줌
    , 0 // 어디다 그리는지 첫번쨰 인덱스 알려줌 
    , positionData.length / 2 // COUNT
);


