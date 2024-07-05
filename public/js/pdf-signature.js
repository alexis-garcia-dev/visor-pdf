class PDFSignature {
    constructor(containerId, options = {}) {
        this.url =
            options.url ||
            "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf";
        this.containerId = containerId;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.scale = 1.5;
        this.rotation = 0;
        this.canvas = null;
        this.ctx = null;
        this.rectangle = null;

        this.initialize();
    }

    async initialize() {
        this.createUI();
        await this.loadPDF();
    }

    createUI() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="sidebar">
                <button id="prevPage" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Anterior</button>
                <button id="nextPage" class="btn btn-primary"><i class="fas fa-arrow-right"></i> Siguiente</button>
                <input type="number" id="pageNumber" min="1" value="1" class="form-control" />
                <span id="pageCount"></span>
                <button id="zoomIn" class="btn btn-secondary" style="display:none;"><i class="fas fa-search-plus"></i> Zoom In</button>
                <button id="zoomOut" class="btn btn-secondary" style="display:none;"><i class="fas fa-search-minus"></i> Zoom Out</button>
                <button id="fitWidth" class="btn btn-secondary" style="display:none;"><i class="fas fa-arrows-alt-h"></i> Ajustar Ancho</button>
                <button id="fitHeight" class="btn btn-secondary" style="display:none;"><i class="fas fa-arrows-alt-v"></i> Ajustar Alto</button>
                <button id="rotateClockwise" class="btn btn-secondary"><i class="fas fa-redo"></i> Rotar CW</button>
                <button id="rotateCounterClockwise" class="btn btn-secondary"><i class="fas fa-undo"></i> Rotar CCW</button>
                <button id="downloadPDF" class="btn btn-secondary"><i class="fas fa-download"></i> Descargar</button>
                
            </div>
            <div class="container mt-4">
                <div id="pdfContainer" class="text-center position-relative"></div>
                <div id="coordinates">X: 0, Y: 0</div>
            </div>
        `;

        this.pdfContainer = container.querySelector("#pdfContainer");
        this.pageNumberInput = container.querySelector("#pageNumber");
        this.pageCountSpan = container.querySelector("#pageCount");
        this.prevPageBtn = container.querySelector("#prevPage");
        this.nextPageBtn = container.querySelector("#nextPage");
        this.zoomInBtn = container.querySelector("#zoomIn");
        this.zoomOutBtn = container.querySelector("#zoomOut");
        this.fitWidthBtn = container.querySelector("#fitWidth");
        this.fitHeightBtn = container.querySelector("#fitHeight");
        this.rotateClockwiseBtn = container.querySelector("#rotateClockwise");
        this.rotateCounterClockwiseBtn = container.querySelector(
            "#rotateCounterClockwise"
        );
        this.downloadPDFBtn = container.querySelector("#downloadPDF");
        this.coordinatesDiv = container.querySelector("#coordinates");

        this.addEventListeners();
    }

    async loadPDF() {
        const pdfjsLib = window["pdfjs-dist/build/pdf"];
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
        this.pdfDoc = await pdfjsLib.getDocument(this.url).promise;
        this.pageCountSpan.textContent = `/ ${this.pdfDoc.numPages}`;
        this.renderPage(this.pageNum);
    }

    renderPage(num) {
        this.pdfDoc.getPage(num).then((page) => {
            const viewport = page.getViewport({
                scale: this.scale,
                rotation: this.rotation,
            });
            if (this.canvas) {
                this.pdfContainer.removeChild(this.canvas);
            }
            if (this.rectangle) {
                this.pdfContainer.removeChild(this.rectangle);
                this.rectangle = null;
            }
            this.canvas = document.createElement("canvas");
            this.canvas.className = "pdfCanvas";
            this.ctx = this.canvas.getContext("2d");
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;
            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport,
            };
            page.render(renderContext).promise.then(() => {
                this.pdfContainer.appendChild(this.canvas);
            });
        });
    }

    addEventListeners() {
        this.prevPageBtn.addEventListener("click", () => {
            if (this.pageNum <= 1) return;
            this.pageNum--;
            this.pageNumberInput.value = this.pageNum;
            this.renderPage(this.pageNum);
        });

        this.nextPageBtn.addEventListener("click", () => {
            if (this.pageNum >= this.pdfDoc.numPages) return;
            this.pageNum++;
            this.pageNumberInput.value = this.pageNum;
            this.renderPage(this.pageNum);
        });

        this.pageNumberInput.addEventListener("change", () => {
            let desiredPage = parseInt(this.pageNumberInput.value);
            if (desiredPage >= 1 && desiredPage <= this.pdfDoc.numPages) {
                this.pageNum = desiredPage;
                this.renderPage(this.pageNum);
            }
        });

        this.zoomInBtn.addEventListener("click", () => {
            this.scale += 0.25;
            this.renderPage(this.pageNum);
        });

        this.zoomOutBtn.addEventListener("click", () => {
            if (this.scale > 0.5) {
                this.scale -= 0.25;
                this.renderPage(this.pageNum);
            }
        });

        this.fitWidthBtn.addEventListener("click", () => {
            this.scale = this.pdfContainer.clientWidth / this.canvas.width;
            this.renderPage(this.pageNum);
        });

        this.fitHeightBtn.addEventListener("click", () => {
            this.scale = this.pdfContainer.clientHeight / this.canvas.height;
            this.renderPage(this.pageNum);
        });

        this.rotateClockwiseBtn.addEventListener("click", () => {
            this.rotation += 90;
            this.renderPage(this.pageNum);
        });

        this.rotateCounterClockwiseBtn.addEventListener("click", () => {
            this.rotation -= 90;
            this.renderPage(this.pageNum);
        });

        this.downloadPDFBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = this.url;
            link.download = "document.pdf";
            link.click();
        });

        this.pdfContainer.addEventListener("mousemove", (event) => {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.coordinatesDiv.textContent = `X: ${x.toFixed(
                2
            )}, Y: ${y.toFixed(2)}`;
            if (!this.rectangle) {
                this.rectangle = document.createElement("div");
                this.rectangle.className = "rectangle";
                this.pdfContainer.appendChild(this.rectangle);
            }
            const rectangleWidth = window.innerWidth < 768 ? 100 : 250;
            const rectangleHeight = window.innerWidth < 768 ? 50 : 125;

            let newX = event.clientX - rect.left - rectangleWidth / 2;
            let newY = event.clientY - rect.top - rectangleHeight / 2;
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + rectangleWidth > rect.width)
                newX = rect.width - rectangleWidth;
            if (newY + rectangleHeight > rect.height)
                newY = rect.height - rectangleHeight;

            this.rectangle.style.left = `${newX}px`;
            this.rectangle.style.top = `${newY}px`;
            this.rectangle.style.width = `${rectangleWidth}px`;
            this.rectangle.style.height = `${rectangleHeight}px`;
        });

        this.pdfContainer.addEventListener("click", (event) => {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log(
                `Coordinates on page ${this.pageNum}: X = ${x}, Y = ${y}`
            );
            Swal.fire({
                title: "¿Quieres firmar en estas coordenadas?",
                text: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)} , en la página ${
                    this.pageNum
                }`,
                showDenyButton: true,
                confirmButtonText: '<i class="fas fa-check"></i> Sí',
                denyButtonText: '<i class="fas fa-times"></i> No',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Yes");
                } else if (result.isDenied) {
                    console.log("No");
                }
            });
        });
    }
}
