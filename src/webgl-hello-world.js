const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

//https://www2.cs.duke.edu/courses/compsci344/spring15/classwork/15_shading/gl-pipeline.png
const program = gl.createProgram(); //function == shaders == vertex + fragment

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

//main doesn't return anyhting, it assignes a value to a global variable gl_Position instead
// webgl은 0,0 이 중간
const vShaderSource = `
    attribute vec2 position;

    void main(){
        gl_PointSize = 20.0;
        gl_Position = vec4(position / 2.0, 0, 1);

    }
`; // pass point coordinate

const fShaderSource = `
    void main(){
        gl_FragColor = vec4(1,0,0,1);
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

const positionPointer = gl.getAttribLocation(program, 'position'); // 애트리뷰트의 위치
//because of GPU accepts only typed arrays as input...
const positionData = new Float32Array([
    -1.0, // top left x
    -1.0, // top left y

    1.0,
    1.0,

    -1.0,
    1.0,

    1.0,
    -1.0
]);
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
    gl.POINTS // 점,선,삼각형 중 어떤 걸 그리는지 알려줌
    , 0 // 어디다 그리는지 첫번쨰 인덱스 알려줌 
    , positionData.length / 2 // COUNT
);


