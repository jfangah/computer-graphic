(function(imageproc) {
    "use strict";

    /*
     * Apply a Gaussian filter to the input data
     */
    imageproc.gaussianBlur = function(inputData, outputData, size) {
        /* Calculate the sigma value */
        var sigma = size/4;

        /* Make the row/column matrix */
        /*var rowMatrix = [];
        var small_gaussian_size=7;
        var smallGaussianTab=[[1],
                              [0.25,0.5,0.25],
                              [0.0625,0.25,0.375,0.25,0.0625],
                              [0.03125,0.109375,0.21875,0.28125,0.21875,0.109375,0.03125]];
        var fixedkernal= size&2 == 1 && size <= small_gaussian_size && sigma <= 0 ? smallGaussianTab[size>>1] : 0;
        var sigmax= sigma > 0 ? sigma : ((size-1)*0.5-1)*0.3+0.8,
            scale2x = -0.5 / (sigmax *sigmax),
            sum = 0;
        var a,b,c;
        for(a=0; a<size;a++){
            b=a-(size-1)*0.5;
            c=fixedkernal ? fixedkernal[a] : Math.exp(scale2x*b*b);
            rowMatrix[a]=c;
            sum += c;
        }

        sum=1/sum;

        for(a=size;a--;){
            rowMatrix[a] *= sum;
        }
        */
        var rowMatrix=[];
        var half=Math.floor(size/2)

        for(var i=0;i<=size;i++){
            rowMatrix[i]=1.0/(Math.sqrt(2*Math.PI)*sigma)*Math.exp(-(i-half)*(i-half)/(2*sigma*sigma));
        }



        /* Create the kernel */
        var kernel = new Array(size);
        for(var i = 0;i<size;i++){
            kernel[i]=new Array(size);
        }

        var divisor = 0;
        for(var i=0;i<size;i++){
            for(var j=0;j<size;j++){
                kernel[i][j]=rowMatrix[i]*rowMatrix[j];
                divisor += kernel[i][j];
            }
        }

        /***** DO NOT REMOVE - for marking *****/
        var line = "";
        console.log("Row matrix:");
        for (var i = 0; i < size; i++)
            line += rowMatrix[i] + " ";
        console.log(line);

        console.log("Kernel:");
        for (var j = 0; j < size; j++) {
            line = "";
            for (var i = 0; i < size; i++) {
                line += kernel[j][i] + " ";
            }
            console.log(line);
        }
        console.log("Divisor: " + divisor);
        /***** DO NOT REMOVE - for marking *****/

        var halfSize = Math.floor(size / 2);

        /* Apply the gaussian filter */
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var sumR = 0, sumG = 0, sumB = 0;

                /* Sum the product of the kernel on the pixels */
                for (var j = -halfSize; j <= halfSize; j++) {
                    for (var i = -halfSize; i <= halfSize; i++) {
                        var pixel =
                            imageproc.getPixel(inputData, x + i, y + j);
                        var coeff = kernel[j + halfSize][i + halfSize];

                        sumR += pixel.r * coeff;
                        sumG += pixel.g * coeff;
                        sumB += pixel.b * coeff;
                    }
                }

                /* Set the averaged pixel to the output data */
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = sumR / divisor;
                outputData.data[i + 1] = sumG / divisor;
                outputData.data[i + 2] = sumB / divisor;
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
