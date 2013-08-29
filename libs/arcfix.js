CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) 
{
    // Signed length of curve
    var signedLength;
    var tau = 2 * Math.PI;

    if (!anticlockwise && (endAngle - startAngle) >= tau) {
        signedLength = tau;
    } else if (anticlockwise && (startAngle - endAngle) >= tau) {
        signedLength = -tau;
    } else {
        var delta = endAngle - startAngle;
        signedLength = delta - tau * Math.floor(delta / tau);

        // If very close to a full number of revolutions, make it full
        if (Math.abs(delta) > 1e-12 && signedLength < 1e-12)
        signedLength = tau;

        // Adjust if anti-clockwise
        if (anticlockwise && signedLength > 0)
        signedLength = signedLength - tau;
    }

    // Minimum number of curves; 1 per quadrant.
    var minCurves = Math.ceil(Math.abs(signedLength)/(Math.PI/2));

    // Number of curves; square-root of radius (or minimum)
    var numCurves = Math.ceil(Math.max(minCurves, Math.sqrt(radius)));

    // "Radius" of control points to ensure that the middle point
    // of the curve is exactly on the circle radius.
    var cpRadius = radius * (2 - Math.cos(signedLength / (numCurves * 2)));

    // Angle step per curve
    var step = signedLength / numCurves;

    // Draw the circle
    this.lineTo(x + radius * Math.cos(startAngle), y + radius * Math.sin(startAngle));
    for (var i = 0, a = startAngle + step, a2 = startAngle + step/2; i < numCurves; ++i, a += step, a2 += step)
        this.quadraticCurveTo(x + cpRadius * Math.cos(a2), y + cpRadius * Math.sin(a2), x + radius * Math.cos(a), y + radius * Math.sin(a));
}
