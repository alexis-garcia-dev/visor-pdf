<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Signature</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        .pdfCanvas {
            border: 1px solid black;
            margin-bottom: 10px;
            width: 100%;
            position: relative;
        }

        .rectangle {
            position: absolute;
            border: 2px solid red;
            pointer-events: none;
        }

        #coordinates {
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 5px;
            border: 1px solid black;
        }

        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 200px;
            background-color: #f8f9fa;
            border-right: 1px solid #ddd;
            padding: 10px;
        }

        .sidebar button,
        .sidebar input {
            width: 100%;
            margin-bottom: 10px;
        }

        .container {
            margin-left: 220px;
        }

        @media (max-width: 767.98px) {
            .sidebar {
                width: 100%;
                height: auto;
                position: relative;
                border-right: none;
                border-bottom: 1px solid #ddd;
            }

            .container {
                margin-left: 0;
                margin-top: 20px;
            }

            .rectangle {
                width: 100px;
                height: 50px;
            }
        }
    </style>
</head>

<body>
    <div id="pdfSignatureApp" class="container">
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/pdf-signature.js') }}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const pdfSignature = new PDFSignature('pdfSignatureApp', {
                url: null,
            });
        });
    </script>
</body>

</html>