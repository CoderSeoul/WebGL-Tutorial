//https://codepen.io/Mamboleoo/pen/jOryeYp

var canvas = document.getElementById('scene');
var ctx = canvas.getContext('2d');
//<canvas> 요소는 getContext() 메서드를 호출해서, 랜더링 컨텍스트와 그리기 함수들을 사용할 수 있다.
var particles = [];

function drawScene() {
  particles = [];
  canvas.width = png.width * 6;
  canvas.height = png.height * 6;

  ctx.drawImage(png, 0, 0);

  var data = ctx.getImageData(0, 0, png.width, png.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //캔버스안에서 특정 영역을 지울 때 사용

  ctx.fillStyle = 'white';

  // x0(시작하는 점의 x좌표), y0(시작하는 점의 y좌표)
  // x1(끝나는 점의 x좌표), y1(끝나는 점의 y좌표)
  for (var y = 0, y2 = data.height; y < y2; y++) {
    for (var x = 0, x2 = data.width; x < x2; x++) {
      if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
        var particle = {
          x0: x,
          y0: y,
          x1: png.width / 2,
          y1: png.height / 2,
          speed: Math.random() * 4 + 2,
        };
        gsap.to(particle, {
          duration: particle.speed,
          x1: particle.x0,
          y1: particle.y0,
          delay: y / 30,
          ease: Elastic.easeOut,
        });
        particles.push(particle);
      }
    }
  }

  requestAnimationFrame(render);
}
var render = function () {
  requestAnimationFrame(render);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0, j = particles.length; i < j; i++) {
    var particle = particles[i];
    ctx.fillRect(particle.x1 * 6, particle.y1 * 6, 3, 3);
  }
};

var png = new Image();
png.onload = () => {
  drawScene();
  window.addEventListener('click', drawScene);
};
png.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHonAACAgwAA+mQAAIDSAAB2hgAA7OkAADmeAAAV/sZ+0zoAAAwbSURBVHja7J17sFVVHcc/oAQIiBIPJ8pUwpDH9cooAU4U9IBAECRBAiEwIMws0tHrheghKKQwJAHyGHmljZNRItrAhcAQBUG0MTHeGA8R4yGSCoG3P9Y64+60z1m/9dj7nnP1O7P+uXef9frutdbvuTYUPj4FXAUMAH4ETAKWAs8B24A3gaO6HAJ2Ai8Ay4EHgDuAwUAnoG6hDa6ysvJ/SiGiOTAImA5s0JNcGaj8C9gMzAdGAK0+ISQelwK3AU8ApwISICkrgHKgzSeEwBDgzykTkK+s11tcnY8TIY2BMr3/VxZoOQg8CLSszoTUA+4HThQwEXHlEeAz1Y2Qn+i3rrJIy/vAZKB+sRPyVeClIiYibisbWIyENABmBZ6Mk/rQfQz4NfAzYDTwbaAX0BPop8XZ8cBUYDGwCng7cF+WAi2KhZDOwIEAg94PLAO+C5QCF3r0qS5whVYuH9XKo2//TgM3FTohd3kOcqeWbroD5yS8nV6rV9nfPfs8s1AJedxjUGuA71ShPvR1rZS69v8FoGGhEFJX7+0uA3lU25gKBZdrk43LWP7pYooJTUhTRwVvBfCVAjZotgYWOYzrA+CaqiKkuYNusV9LRcWCLtoYaTPGD21etlCENNZmb5uOLkpCsUoJkxxWS4e0CKntIDYOovhxLXDYYsxntKidOCEbLTr1CtCW6oMmKMeXdPxHtJKcGCE2ouEKoAbVE7Mt5uG1pAixUfoWpDg5fYC1WhcYnWK74yzF+6CEtLdofH5KE1IPWBLT/lrgkpT6MNZiXoaFIuRclC9a0ujilCZigMFedhoVEJEG7rYg5ZIQhMwXNlaRwuAbAA9bTMBylL8+aUwT9udFX0JKhQ1tL4BVkaucSmm1PCPsz3AfQna6LsWAqE8Y38qyhPtZC1nI0lkirgQbQn4oHGiSppA+DhYBkw/j1gT7+0VhPxa6EHJSUPHjCQ2sITAPmRcx+2/HhGfLZQn1/R4hKRfbEHK/oMJ3UGGeoTFEYKJ4D7guRz8XAh2BPYY6/qMlpCTwomD+VksJqSdkuGcCq0KiAVfwkT/7wZj//ykyjt8KV0vo+KvPCefwCgkhZYKKNgQeQF/gLUG7o7J+F3fYP5X1TC/BijsL3B54THME4/m9hJD9goquCtTpC1CBaJJVEeeNmykgJNPOwpRXS0PhOdw4HyH9kYXAhMD1AgvAh8CYPHVICcmgt7bAmlZLKElsvGA+p+QjROIbb+3ZyfOFb+uTWowkICGgnGsSCW4Vysfuq0OZovkP5SKkqaCTL3l2sLdA2z6tjXYSuBCSwY2YXdBnDCtUAsmW/OU4QsYIfni9hw1qvvCttNEPfAjJ9Et6trhGKn5eUP+MOEJMtpi3HDvUC9gnOCvudKjbl5AMBgnOsw+AkY5z8Kyh7r3ZhDQT7HXTHCSoJcKzwnWvDkUI2r4kEVX/gsBXnoVbBPV2jRIySLLPWUpQhwVnha8V9jc5jIg+6IcsvMnmbGmipbd89U2IEjLd8PAxYcM1UU4q02CeIkz0+KSE7Gv1hVaDVUAjYZ0vG+paGyXEFAz2tLDRyYZ6jqOSd0KgE7CV+ByOGwK1MRDYG2huTEbHtzOE1EDleOd7+GZho9vz1LE7oDFyiuDtfSxge+sNhk5JpH6JoM8laDOI6cFWAZblCb3n+5i9O2o7mtT/8YY+E3zMH/eS3/F0WEh8A4HgNARUGoBJ3JOGgEriYE+jspxs8QvcHVMLURGXNuiOzAP4JspbKMHzhrruALNncL3FIGwCk6VOos6YoyVPCfSIPVo7N6GeUPx1IWSBoa55YHZGLU6IkIyTaGie+soFdWzTFtrzgb8Knp+pJz0O3QRKrA8hprNvHZjDQ6d7ErJdKAZHV0sHZNm7v+T/w1XH6IPWlBbR18G0s1dbFVwJGWmo/28IDskJnoQMBq4UKIqnUEmUtwkmZqvBJ9Nc+1BM9UxFuYJNgRRntGG0qych3Qzt7ELwBo/yJOQu/b9GQqXRVB6w6M/tWijxaW9lxGl1g+eW1QFzHrzx7ejvSci4rGcGIA9NjZZ/WJpvMmiBivd1ISNbib3Zk5BSzOkLRqWwpych5THP1dKa62lk0S3DAyh3vZAH/s3R9qdsDPEkpK3AkmEk5FsJEJIxaEruxjqCyvXzRQtUroaEkJ/nqMOXkDYSQkzKT7/AhJQAWxy2j+XaTeCCuQ7t7QN6BCakRLJl7TI8NMKTkPGR/0/wPGCPoq7akOKbOQyQNmUWH11oNtiTkGsEOo1RmSv3JGSAVtqeFwx+ilBLfkI7wPJhuqCeZ1DXa5ie26MlrQ6ehHQRtMOygJ7CzTm0T5PDZ5uW0TMYpvfTvObqjDEuC98QropxWVvJGoFVYb2nHjLU0MaraOUoVL7gZsLpFc1QuXmm3z+NyvJCuLrWkDuU6QcO/bchZCLmO1OMeXIVCRHyut7jTRiOOcx0B7AJcyBFmaC9dpiDElwJMcWDLZEso6MWjh4pIVOxS5m+ABUx6Xowb8IcdJeNsQkQstJQV1nGvG1qVOpU2mJ4Q9fpPd4VQx20/HKP9toBfzToS4eEL2wdreQa091qA+8SJkBuh0mkC4BPI7tNYRPhLkfOt/JPRs6wfJBkV3XMPGy6Ve13wo4vMlhMN2hPXAgMIz4s9YQ2y4TAlVpoyLdCtgjrMkWGHifimzf5Ag4JG71QSwqmN2Gyxb6bD/kSdnwhybHcgzzewOQ82xgNAxohaLzUYjAST98u4Guek/ZQAoRcLlRiZ1kIO+cJ7HZTooRc5mFwy2f7l9wcNNVjtYQMJQUVZHBGsCp6W9YrybvpnR1svU4g67vgx0LXaM8qJKRUuNX+CvvoFfSqNVkd6mQTIrmzo7MjKaVCZeshocQSkhDJuLdbuiGiaIg5rndRXDqCZNta6bk/Swa/I8bsnQQhbS3OCp87hO8TtNEnV0rbq4IfN/ckpT2y6MOpmD9R5ErInYL2d6O8jD6ogfkig3eBWrkIkWRRzSQMJDcevIG60D8UIS2FgsbMQGK5RHp9JF/SZ03M3/c4i0qMD4H2yILbZuQ4TG0IuTvGdB53VvQINLaayPJMWpry1CWOnVCp0Rn8VLiFdHEgpJVAgsyEcZ6T8pjWSC4OuEhotAt922h7oST2sH77ID6DKpqvMUG4KnoFHst5KIeWOPvWdPmMJDdwG8lAcmnxa/o8iLuIci4qhGelZP921CtMkLgKXgf5bUDnC1fJ5IRIaYc5uO0s8Tf+7BZINttRX0RIAjcJ5+5qG0LQWqmk4vYkhzL8IkbiymyS+zZJPWTBf6syP7AhpA6yL6odI9lPmtq6VPNtsT1IFtJ4s0tdCEEb0SQNrCZ5+MR02VhmXTFD2JeJ0R+5XBNbIWxoZgqktBPqLVETf9cU+vU9YX8OZP/QhZCmpOO/toHkmu/ZKawKUJeASuenUwhCID4vIlcZmxIpbXLs2QeRhReFQA+LebkvrgKfy/jnWTReRnoo16LuPm1laJBSuzYr47lclfh+ruJli05MI13UTLGtkRbz8I7W6xIhpA52H5xfiuPn5AoY07GT8PLewBfiCztfECo/0TyL0mpARFNkbt5ouc5UaaiPgl3toAuUFzEZwzFH48elYZAWIaA+DWdLympU8Fmx4LNCQ2t2uUXaQOgPS37JcvuKBjNcVMBEnIvyZ7znMLYbbRpK4tOrbXD7eP1xbQ5pUkBE1Aa+j/vXpPvYNpjUx4kb45bImXHyz8H+HsOQaIa682Wf4xgOo++6KhRCMliAn0V2pbYLXZwCCY1QSZx/AP7t0ecKn1WexgfuR+JvKj+Lig4Zh8pcDbGt1dfi961auDgRoJ+TfDuVBiEZq2wF4ZxK76MCFRbrrWUUKlC7o5ba2uhSgoop7opK7pmIiuxfgfmCBJuyFf9A8VQJyWA0si8EFFOZGHKC0iYELd7OqQZEPJmEDlUVhGTQGhWiU2xEbMDi++jFREhUmVyM7OKZqizLcY94LypCMmiOukpjVwGRcBgV11WS1iQUEiFRdEMFImytAhIOaP2pL7kvx/zYERJFd1Rk/BoPzdmUwLoR5VLtTzKRi9WKkChqamVuICqnYy7qcxGvoBJ7DqIuEjiuyxFUPvwuVK7Ls/q8ugd1UU1H0gl8cCbkvwMAQeq/VEc+G9gAAAAASUVORK5CYII=';
