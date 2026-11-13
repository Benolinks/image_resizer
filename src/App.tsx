import { useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoFolderOpenSharp } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { CiSettings } from "react-icons/ci";




import { Format } from "./category.ts";


const App = () => {

  // all usestates
  const [showImage, setShowImage] = useState<File | undefined|null>();

  const [preview, setPreview] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [downloadError, setDownloadError] = useState("");

  // checking if their is any image to delete 
  const checkDelete = () => {
    if (preview!= null) {
      setConfirmDelete(true)
      
    }
  };

  const handleSize = (event: React.SyntheticEvent<HTMLImageElement>)=>{
     const sizewidth =  event.currentTarget.naturalWidth;
     const sizeHeight =  event.currentTarget.naturalHeight

     if (sizeHeight && sizewidth) {
      setHeight(sizeHeight)
      setWidth(sizewidth)
     }
  }

// functions to handle image upload on browser URL
  const handlefile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setShowImage(file);
      const imageurl = URL.createObjectURL(file);
      setPreview(imageurl);
      
      
    }
  };


  const resizeImage = async () => {
    if (!preview) {
      setDownloadError("Choose an image before downloading.");
      return;
    }

    const targetWidth = Number(width);
    const targetHeight = Number(height);
    if (
      !Number.isInteger(targetWidth) ||
      targetWidth <= 0 ||
      !Number.isInteger(targetHeight) ||
      targetHeight <= 0
    ) {
      setDownloadError("Enter a valid width and height greater than zero.");
      return;
    }

    try {
      const image = new Image();
      image.src = preview;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not create a canvas context.");
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Could not create the resized image."));
          }
        }, "image/png");
      });

      const downloadUrl = URL.createObjectURL(blob);
      setDownloaded(downloadUrl)
      const link = document.createElement("a");
      link.href = downloadUrl;
       link.download = "resized-image.png";
     console.log(downloaded)
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      setDownloadError("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not resize the image.";
      setDownloadError(message);
      console.error("Image resize/download failed:", error);
    }
  };

  // useref used to hook input fied to the parent div for onchange function 
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <main className="bg-gray-100 p-3">
      <div>
        {/* project name div */}
        <div
          className="flex text-center items-center 
          gap-4 w-60 m-auto mt-4"
        >
          <FaImage style={{ color: "blue", fontSize: "30px" }} />
          <h1
            className="font-bold 
          text-blue-800"
          >
            IMAGE COMPRESSOR{" "}
          </h1>
        </div>
        {/* ========================== */}

        <div
          className="text-center 
          justify-center m-auto 
           w-100 mt-5"
        >
          {/* simple write-up */}
          <p
            className=" 
            bg-[rgba(0,0,255,0.2)]  
            text-blue-700
             rounded-full w-max p-2 font-bold m-auto"
          >
            FAST . SIMPLE . PRIVATE 
          </p>

          {/* 100& write-up */}
          <h1 className="text-3xl text-blue-950 font-bold mt-5">
            Make images
            <b className="text-blue-800"> Lighter.</b>
          </h1>

          <p className="w-full text-blue-950 font-medium my-6">
            Compress and optimize your images right from your browser.
            <b
              className="bg-[rgba(39,241,62,0.5)]
                 p-1 ms-4 rounded-full "
            >
              100% safe and private{" "}
            </b>
          </p>
        </div>

        {/* top layer begins  */}

        <div
          className="my-10 flex items-center 
                gap-16 mx-5 flex-wrap border shadow-2xl rounded-2xl p-4 "
        >
          {/* image upload area with cloud icon */}
          <div
            className="flex w-full max-w-xl flex-col 
                items-center justify-center"
          >
            <input
              type="file"
              ref={fileInput}
              className="hidden"
              accept="image/*"
              onChange={handlefile}
            />
            <div
              onClick={() => fileInput.current?.click()}
              className="border-2 border-dotted
                  rounded-xl border-gray-400
                text-center  p-4 w-full"
            >
              <div
                className="flex flex-col items-center 
                  justify-center"
              >
                <IoCloudUploadOutline
                  style={{ fontSize: "100px", color: "blue" }}
                />

                <p
                  className="text-blue-700 
                    font-medium"
                >
                  {showImage?.name ?? "browser files"}
                </p>
                <div className="flex justify-center">
                  <button
                    className="inline-flex 
                    items-center justify-center 
                    font-bold bg-blue-800 text-white p-1 
                    rounded-full px-4 gap-2"
                  >
                    <IoFolderOpenSharp
                      style={{ color: "white", fontSize: "20px" }}
                    />
                    Choose Image{" "}
                  </button>
                </div>
              </div>
            </div>
            {/* /delete  section  */}
            <div
              className="flex justify-between w-full my-5 
              border-2 border-gray-300 rounded-xl p-1"
            >
              <div className="flex flex-row gap-4 ">
                {/* display image and resolution */}

                {preview != null && (
                  <img
                    className="w-10 h-10 object-center rounded-full"
                    src={preview}
                    alt="preview"
                    onLoad={handleSize}
                  />
                )}

                <div className="item-center 
                text-center flex flex-col">
                  Width
              {
                preview !=null && ( 
                  <p><b>{width}</b></p>
                )
              }
              </div>
              {/* height */}
                <div className="item-center 
                text-center flex flex-col">
                  Height
              {
                preview !=null && ( 
                  <p><b>{height}</b></p>
                )
              }
              </div>
              </div>
              <div>
                <button
                  onClick={checkDelete}
                  className="bg-[#b0a3a3] p-2 
                h-max m-auto flex justify-end  border
                 rounded-full text-red-600 text-2xl"
                >
                  <MdOutlineDeleteForever  />
                </button>
              </div>
            </div>
            {/* === */}
          </div>
          {/*  compression setting */}
          <div className=" mb-10 border p-8 rounded-xl">
            <div className="flex text-center items-center gap-2 my-3">
              <CiSettings
                style={{
                  fontSize: "25px",
                  font: "bold",
                }}
              />
              <h2 className="font-medium  text-2xl mb-2">
                compression settings{" "}
              </h2>
            </div>
            <div className="flex gap-12">
              <h1 className="font-medium">Output Format:</h1>

              <div className="flex gap-8 ">
                {Format.map((format) => {
                  return (
                    <div key={format.id}>
                      <p
                        className="bg-blue-700 text-white
                       p-2 rounded-full px-3"
                      >
                        {format.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between gap-20 mt-6 mb-4">
              <h1 className="font-medium">Resize </h1>

              <div className="flex flex-col">
                <label htmlFor="width" className="">
                  Width
                </label>
                
                {
                  preview != null && (
                    <input
                  type="number"
                  placeholder="width"
                  className="w-20 border-2"
                  value={(width)}
                  onChange={(e)=>{setWidth(e.target.value)}}
                />
                  )
                }


                
              </div>
              <div className="flex flex-col">
                <label htmlFor="width">Height</label>

                {
                  preview != null && (
                    <input
                  type="number"
                  placeholder="width"
                  className="w-20 border-2"
                  value={(height)}
                  onChange={(e)=>{setHeight(e.target.value)}}
                />
                  )
                }
              </div>
            </div>
          
          </div>
          {/* === */}
           <div
              className="flex justify-center  my-3 
              border-2 border-gray-300 rounded-xl p-1 m-auto 
              px-40 w-1/2 bg-blue-700 z-10"
            >
           
              <button
              onClick={resizeImage}
               className="text-white
               font-bold text-xl">Download</button>
            </div>
            {downloadError && (
              <p className="text-center text-red-600" role="alert">
                {downloadError}
              </p>
            )}
            {/* == */}
        </div>
        


          {/* confirmation to delete image  */}
        {confirmDelete  && (
          <div className="fixed inset-0 z-50 flex items-center 
          justify-center bg-black/50">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="mb-4">Delete this image?</p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="rounded bg-gray-200 px-4 py-2"
                  onClick={() => setConfirmDelete(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="rounded bg-red-600 px-4 py-2 text-white"
                  onClick={() => {
                    if (preview) {
                      URL.revokeObjectURL(preview);
                    }
                    setShowImage(null);
                    setPreview(null);
                    setConfirmDelete(false);
                    if (fileInput.current) {
                      fileInput.current.value = "";
                    }
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
        {/*  */}

        {/* second and last layer  */}

        {
          preview !=null && (
            <div className="flex p-2 border 
        justify-between gap-3">
          {/* first second  */}
          <div className=" border-2 p-2 mx-10 rounded-xl">
            <img
            className="h-100 w-100 object-cover rounded-3xl  "
             src={preview} alt="" />

          </div>
          {/* seond section */}
        {
          downloaded !=null &&(
            <div className=" border-2 p-2 mx-10 rounded-xl">
            <img
            className="h-100 w-100 object-cover rounded-3xl  "
             src={preview} alt="" />

          </div>
          )
        }
          
        </div>
          )
        }

        {/* ================================================================ */}
        {/* lower div */}
      </div>
    </main>
  );
};

export default App;
