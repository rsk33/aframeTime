import { createNoise2D } from 'simplex-noise';
const noise2D = createNoise2D();

function lerp(a, b, t)
{
    // wrap when close to zero
    a = (a < 0.01) ? b - a : a;
    return a + t * (b - a);
}

AFRAME.registerComponent('sketch', {
    schema: {
        time: {type: 'float', default: 0.0}
    },

	init: function()
	{
		this.canvas = document.querySelector("#mysketch");
		this.context = this.canvas.getContext('2d');
        this.diag = Math.min(this.canvas.width, this.canvas.height)
        this.circleCenter = [];   
        this.circleCenter.x = 0.5*this.diag;   
        this.circleCenter.y = 0.5*this.diag;   
        this.pointerLength = [];
        this.pointerLength.x = 0;
        this.pointerLength.y = 0;
        this.time = 0;
        this.timeTarget = 0;
        this.isTimeZoneNegative = false;
        
	},
    
    update: function () {
        const data = this.data;
        this.isTimeZoneNegative = data.time < 0;
        this.timeTarget = Math.abs(data.time);
    },
	
	tick: function(t)
	{	
		// clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // animation
        this.time = lerp(this.time, this.timeTarget, 0.05);
        this.pointerLength.x = -0.08*this.diag*Math.cos((this.time/3 + 1)*Math.PI/2);
        this.pointerLength.y = -0.08*this.diag*Math.sin((this.time/3 + 1)*Math.PI/2);
        this.circleCenter.x = 0.5*this.diag*(1.0 + 0.8*noise2D(0.00001*t,0.00002*t));
        this.circleCenter.y = 0.5*this.diag*(1.0 + 0.8*noise2D(0.00003*t,0.00001*t));
		// draw circle
        this.context.lineWidth = 1;
        this.context.strokeStyle = "#00FFFF";
        this.context.beginPath();
        this.context.arc(this.circleCenter.x, this.circleCenter.y, 0.1*this.diag, 0, 2*Math.PI);
        this.context.closePath();
        this.context.stroke();
        this.context.strokeStyle = this.isTimeZoneNegative ? "#CE1483" : "#00FFFF";
        this.context.beginPath();
        this.context.moveTo(this.circleCenter.x, this.circleCenter.y);
        this.context.lineTo(this.circleCenter.x + this.pointerLength.x, this.circleCenter.y + this.pointerLength.y);
        this.context.closePath();
        this.context.stroke();

		// thanks to https://github.com/aframevr/aframe/issues/3936 for the update fix
		let material = this.el.getObject3D('mesh').material;
	    if (!material.map)
	     	return;
        else
        	material.map.needsUpdate = true;
	}
});