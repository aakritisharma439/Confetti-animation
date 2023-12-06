var maxParticleCount = 150;
var particleSpeed = 2;
var confettiTimeout;

var requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 16.6666667);
        }
    );
})();

(function () {
    var colors = [
        "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", 
        "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson", "MediumPurple", 
        "DarkOrange", "MediumSeaGreen", "CornflowerBlue", "Tomato", "RoyalBlue", 
        "MediumVioletRed", "DarkOliveGreen", "DarkSlateGray", "Indigo", "DarkMagenta", 
        "DarkSlateBlue", "MediumSpringGreen", "FireBrick", "RebeccaPurple", 
        "DarkTurquoise", "MediumOrchid", "Sienna", "ForestGreen", "Teal"
    ];
    var streamingConfetti = false;
    var animationTimer = null;
    var particles = [];
    var waveAngle = 0;

    function resetParticle(particle, width, height) {
        particle.color = colors[(Math.random() * colors.length) | 0];
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 8 + 4;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = 0;
        return particle;
    }

    function startConfettiInner() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            canvas.setAttribute(
                "style",
                "position: fixed; top: 0; left: 0; display:block; z-index: 999999; pointer-events:none"
            );
            document.body.appendChild(canvas);
            canvas.width = width;
            canvas.height = height;
            confettiTimeout = setTimeout(function () {
                stopConfettiInner();
				showThanksMessage();
            }, 10000);
        }
        var context = canvas.getContext("2d");
        while (particles.length < maxParticleCount) particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        if (animationTimer === null) {
            (function runAnimation() {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (particles.length === 0) animationTimer = null;
                else {
                    updateParticles();
                    drawParticles(context);
                    animationTimer = requestAnimFrame(runAnimation);
                }
            })();
        }
    }
	function showThanksMessage() {
		var container = document.querySelector('.container');
		var message = "Thanks for watching";
		var index = 0;
	
		function displayNextCharacter() {
			container.innerHTML += message[index];
			index++;
	
			if (index < message.length) {
				setTimeout(displayNextCharacter, 100);
			}
		}
		displayNextCharacter();
	}
    function stopConfettiInner() {
        streamingConfetti = false;
        clearTimeout(confettiTimeout);
    }

    function drawParticles(context) {
        var particle;
        var x;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            context.strokeStyle = particle.color;
            x = particle.x + particle.tilt;
            context.moveTo(x + particle.diameter / 2, particle.y);
            context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
            context.stroke();
        }
    }

    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15) particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle);
                particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti && particles.length <= maxParticleCount)
                    resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
	
    startConfettiInner();
})();
