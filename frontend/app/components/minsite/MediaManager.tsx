import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetcher } from "@remix-run/react";
import type { Upload } from "~/types/models";

interface MediaManagerProps {
  uploads: Upload[];
  onSelect: (upload: Upload) => void;
}

export function MediaManager({ uploads, onSelect }: MediaManagerProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const fetcher = useFetcher();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    fetcher.submit(formData, {
      method: "post",
      action: "/api/upload",
      encType: "multipart/form-data"
    });
  };

  return (
    <div className="media-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 ${view === "grid" ? "text-blue-500" : "text-gray-500"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 ${view === "list" ? "text-blue-500" : "text-gray-500"}`}
          >
            List
          </button>
          <label className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">
            Upload
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept="image/*,video/*"
            />
          </label>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          layout
          className={view === "grid" ? "grid grid-cols-3 gap-4" : "space-y-2"}
        >
          {uploads.map((upload) => (
            <motion.div
              key={upload.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onSelect(upload)}
              className={`cursor-pointer rounded-lg overflow-hidden border hover:border-blue-500 ${
                view === "grid" ? "aspect-square" : "flex items-center p-2"
              }`}
            >
              {upload.contentType.startsWith("image/") ? (
                <img
                  src={upload.path}
                  alt={upload.filename}
                  className={view === "grid" ? "w-full h-full object-cover" : "w-16 h-16 object-cover"}
                />
              ) : (
                <video
                  src={upload.path}
                  className={view === "grid" ? "w-full h-full object-cover" : "w-16 h-16 object-cover"}
                />
              )}
              {view === "list" && (
                <div className="ml-4">
                  <p className="font-medium">{upload.filename}</p>
                  <p className="text-sm text-gray-500">{upload.contentType}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
