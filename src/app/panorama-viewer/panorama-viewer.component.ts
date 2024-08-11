import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import * as PANOLENS from 'panolens';

@Component({
  selector: 'app-panorama-viewer',
  templateUrl: './panorama-viewer.component.html',
  styleUrls: ['./panorama-viewer.component.css']
})
export class PanoramaViewerComponent implements AfterViewInit  {
  @ViewChild('screenshotCanvas', { static: true }) screenshotCanvas!: ElementRef;
  @ViewChild('panoramaContainer', { static: true }) panoramaContainer!: ElementRef;
  isCropping = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  ctx!: CanvasRenderingContext2D;
  screenShot:any

viewer:any
  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.initializePanolens();
    this.initializeCanvas();
  }


  initializePanolens(): void {
    debugger
      var imageLike='https://i0.wp.com/picjumbo.com/wp-content/uploads/breathtaking-bali-nature-free-photo.jpg?w=600&quality=80'
      const panorama = new PANOLENS.ImagePanorama('assets/panaroma.png'); // Replace with your image path
    this.viewer = new PANOLENS.Viewer({
      container: this.panoramaContainer.nativeElement
    });

    this.viewer.add(panorama);
    this.screenShot=true;
    }

    initializeCanvas(): void {
      const canvasElement = this.screenshotCanvas.nativeElement;
      canvasElement.width = this.panoramaContainer.nativeElement.clientWidth;
      canvasElement.height = this.panoramaContainer.nativeElement.clientHeight;
      this.ctx = canvasElement.getContext('2d')!;
      
    }
    enableCrop(): void {
      this.isCropping = true;
      this.renderer.listen(this.panoramaContainer.nativeElement, 'mousedown', (event: MouseEvent) => this.startCrop(event));
      this.renderer.listen(this.panoramaContainer.nativeElement, 'mousemove', (event: MouseEvent) => this.drawCrop(event));
      this.renderer.listen(this.panoramaContainer.nativeElement, 'mouseup', () => this.endCrop());
    }
  
    startCrop(event: MouseEvent): void {
      if (!this.isCropping) return;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
      this.ctx.clearRect(0, 0, this.screenshotCanvas.nativeElement.width, this.screenshotCanvas.nativeElement.height);
    }
  
    drawCrop(event: MouseEvent): void {
      if (!this.isCropping || !this.ctx) return;
      this.currentX = event.offsetX;
      this.currentY = event.offsetY;
      this.ctx.clearRect(0, 0, this.screenshotCanvas.nativeElement.width, this.screenshotCanvas.nativeElement.height);
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.startX, this.startY, this.currentX - this.startX, this.currentY - this.startY);
    }
  
    endCrop(): void {
      this.isCropping = false;
      this.screenShot=false
    }
  
    // saveScreenshot(): void {
    //   const container = this.panoramaContainer.nativeElement;
    //   const rectWidth = this.currentX - this.startX;
    //   const rectHeight = this.currentY - this.startY;
  
    //   const cropCanvas = document.createElement('canvas');
    //   cropCanvas.width = rectWidth;
    //   cropCanvas.height = rectHeight;
    //   const cropCtx = cropCanvas.getContext('2d');
  
    //   if (cropCtx) {
    //     cropCtx.drawImage(cropCanvas, this.startX, this.startY, rectWidth, rectHeight, 0, 0, rectWidth, rectHeight);
      
    //     // Save the cropped image
    //     cropCanvas.toBlob((blob) => {
    //       if (blob) {
    //         const link = document.createElement('a');
    //         link.href = URL.createObjectURL(blob);
    //         link.download = 'screenshot.png';
    //         link.click();
    //       }
    //     });
    //   }
    // }

    saveScreenshot(): void {
      const renderer = this.viewer.getRenderer(); // Assuming you have a reference to the viewer
      const camera = this.viewer.getCamera();     // Assuming you have a reference to the viewer
      const scene = this.viewer.getScene();       // Assuming you have a reference to the viewer
    
      // Create a temporary canvas to capture the entire scene
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = renderer.domElement.width;
      tempCanvas.height = renderer.domElement.height;
      const tempCtx = tempCanvas.getContext('2d');
    
      if (tempCtx) {
        // Render the scene to the temporary canvas
        renderer.render(scene, camera);
        tempCtx.drawImage(renderer.domElement, 0, 0);
    
        // Now crop the selected area
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = this.currentX - this.startX;
        croppedCanvas.height = this.currentY - this.startY;
        const croppedCtx = croppedCanvas.getContext('2d');
    
        if (croppedCtx) {
          croppedCtx.drawImage(
            tempCanvas,
            this.startX,
            this.startY,
            this.currentX - this.startX,
            this.currentY - this.startY,
            0,
            0,
            croppedCanvas.width,
            croppedCanvas.height
          );
    
          // Save the cropped image as a blob
          croppedCanvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'screenshot.png';
              link.click();
              this.screenShot=true
            }
          });
        }
      }
    }
    
}
