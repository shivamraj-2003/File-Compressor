import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function Content() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    const handleImageUpload = (event) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);
        setOriginalSize(imageFile.size);
    };

    const handleImageCompression = async () => {
        if (!selectedImage) return;

        const options = {
            maxSizeMB: 1, // Maximum size in MB
            maxWidthOrHeight: 800, // Max width or height
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(selectedImage, options);
            setCompressedImage(compressedFile);
            setCompressedSize(compressedFile.size);
        } catch (error) {
            console.error("Error during compression: ", error);
        }
    };

    const downloadImage = () => {
        if (!compressedImage) return;

        const url = URL.createObjectURL(compressedImage);
        const a = document.createElement("a");
        a.href = url;
        a.download = compressedImage.name || "compressed-image.jpg";
        a.click();
        URL.revokeObjectURL(url);
    };
    const [select, setSelectImage] = useState(null);

    const handle = (event) => {
        const imageFile = event.target.files[0];
        setSelectImage(imageFile);
    };

    const convertToPDF = () => {
        if (!select) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgData = event.target.result;
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 10, 10, 180, 160);
            pdf.save("converted-image.pdf");
        };
        reader.readAsDataURL(select);
    };

    const convertToWord = () => {
        if (!select) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgData = event.target.result;
            const html = `<img src="${imgData}" />`;
            const blob = new Blob(["\ufeff", html], {
                type: "application/msword",
            });
            saveAs(blob, "converted-image.doc");
        };
        reader.readAsDataURL(select);
    };

    const convertToExcel = () => {
        if (!select) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgData = event.target.result;
            const worksheet = XLSX.utils.aoa_to_sheet([["Image"], [imgData]]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "converted-image.xlsx");
        };
        reader.readAsDataURL(select);
    };
    return (
        <div
            className="min-h-screen bg-cover bg-center  text-center  "
            style={ { backgroundImage: `url('/p1.jpg')` } }
        >
            <h1 className='font-bold text-4xl'>Steps follow to compress the image:-</h1>
            <br />
            <h1 className='text-xl font-bold text-red-500 '>1. Upload the Image</h1>
            <h1 className='text-xl font-bold text-green-400 '>2. Click on Compress the image button</h1>
            <h1 className='text-xl font-bold text-blue-800 '>3. Download the image</h1>
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Image Compressor</h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={ handleImageUpload }
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                    />

                    <button
                        onClick={ handleImageCompression }
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                        disabled={ !selectedImage }
                    >
                        Compress Image
                    </button>

                    { compressedImage && (
                        <div className="mt-4">
                            <p>Original Size: { (originalSize / 1024).toFixed(2) } KB</p>
                            <p>Compressed Size: { (compressedSize / 1024).toFixed(2) } KB</p>

                            <button
                                onClick={ downloadImage }
                                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Download Compressed Image
                            </button>
                        </div>
                    ) }
                </div>
            </div>
            <br />
            <h1 className='font-bold text-4xl'>Steps follow to convert  the image into Pdf,Word,Excel:-</h1>
            <br />
            <h1 className='text-xl font-bold text-red-500 '>1. Upload the Image</h1>
            <h1 className='text-xl font-bold text-green-400 '>2. Click on Format which you want to Convert</h1>
            <h1 className='text-xl font-bold text-blue-800 '>3. Download the image</h1>
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Image Converter</h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={ handle }
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                    />

                    <button
                        onClick={ convertToPDF }
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                        disabled={ !select }
                    >
                        Convert to PDF
                    </button>

                    <button
                        onClick={ convertToWord }
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                        disabled={ !select }
                    >
                        Convert to Word
                    </button>

                    <button
                        onClick={ convertToExcel }
                        className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        disabled={ !select }
                    >
                        Convert to Excel
                    </button>
                </div>
            </div>
        </div>
    )
}
