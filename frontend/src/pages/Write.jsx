import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { hubService } from "../features/blog/services/hub.service";
import Navbar from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import {
  Loader2,
  Image as ImageIcon,
  X,
  Bold,
  Italic,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Quote,
  Check,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";

export default function Write() {
  const navigate = useNavigate();

  // --- STATE ---
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // UI States
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [error, setError] = useState("");

  // Link Input State (Bubble Menu)
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Publish Metadata State
  const [hubs, setHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");

  // --- FETCH HUBS ---
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const data = await hubService.getAllHubs();
        setHubs(data.data);
      } catch (err) {
        console.error("Failed to fetch hubs");
      }
    };
    fetchHubs();
  }, []);

  // --- HELPER: Extract Image URLs from HTML ---
  const extractImageUrls = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");
    return Array.from(images).map((img) => img.src);
  };

  // --- EDITOR SETUP ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-zinc max-w-none focus:outline-none min-h-[300px]",
      },
    },
    onSelectionUpdate: ({ editor }) => {
      if (!editor.isActive("link")) {
        setShowLinkInput(false);
        setLinkUrl("");
      }
    },
  });

  // --- HANDLERS ---

  // 1. Image Upload
  const uploadImage = async (file) => {
    setIsUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.imageUrl;
    } catch (error) {
      console.error("Upload failed", error);
      setError("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setCoverImage(url);
    }
  };

  const addInlineImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const url = await uploadImage(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }, [editor]);

  // 2. Link Handlers (Custom UI)
  const openLinkInput = () => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkInput(false);
  };

  // 3. Pre-Publish Validation
  const handlePrePublish = () => {
    setError("");
    if (!title.trim()) {
      setError("Please add a title to your story.");
      return;
    }
    if (editor.isEmpty) {
      setError("Your story cannot be empty.");
      return;
    }
    setShowPublishModal(true);
  };

  // 4. Final Publish
  const handlePublish = async () => {
    if (!selectedHub) {
      setError("Please select a Tech Hub.");
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      const htmlContent = editor.getHTML();

      const payload = {
        title,
        content: htmlContent,
        coverImage,
        contentImages: extractImageUrls(htmlContent),
        techHubId: selectedHub,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        summary: summary || editor.getText().substring(0, 150) + "...",
      };

      await api.post("/posts", payload);
      // snackbar success
      showSuccess("Post published successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Failed to publish post. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  function showSuccess(message) {
    alert(message);
  }

  return (
    <div className='min-h-screen bg-white pb-20'>
      <Navbar />

      <div className='container mx-auto px-4 max-w-3xl pt-10'>
        {/* Error Notification Banner */}
        {error && !showPublishModal && (
          <div className='mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm'>
            <AlertCircle className='w-4 h-4' />
            {error}
          </div>
        )}

        {/* --- 1. ACTIONS BAR --- */}
        <div className='flex justify-between items-center mb-8'>
          <div className='text-sm text-zinc-500'>Draft</div>
          <Button
            onClick={handlePrePublish}
            disabled={isUploading}
            className='bg-green-600 hover:bg-green-700 text-white rounded-full px-6 disabled:opacity-50'
          >
            Publish
          </Button>
        </div>

        {/* --- 2. COVER IMAGE UPLOADER --- */}
        <div className='mb-8 group relative'>
          {!coverImage ? (
            <div className='flex items-center gap-4'>
              <label className='cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-zinc-800 transition-colors'>
                <div className='p-2 bg-zinc-100 rounded-full'>
                  {isUploading ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : (
                    <ImageIcon className='w-5 h-5' />
                  )}
                </div>
                <span className='text-sm'>Add a cover image</span>
                <input
                  type='file'
                  className='hidden'
                  onChange={handleCoverImageChange}
                  accept='image/*'
                />
              </label>
            </div>
          ) : (
            <div className='relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-zinc-100'>
              <img
                src={coverImage}
                alt='Cover'
                className='w-full h-full object-cover'
              />
              <button
                onClick={() => setCoverImage("")}
                className='absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-zinc-600 transition-all shadow-sm'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          )}
        </div>

        {/* --- 3. TITLE INPUT --- */}
        <textarea
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full text-4xl md:text-5xl font-bold text-zinc-900 placeholder:text-zinc-300 border-none focus:ring-0 resize-none overflow-hidden bg-transparent p-0 mb-4 font-serif leading-tight'
          rows={1}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />

        {/* --- 4. TIPTAP EDITOR --- */}
        <div className='relative'>
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className='bg-black text-white px-2 py-1.5 rounded-lg shadow-xl flex items-center gap-1'
            >
              {showLinkInput ? (
                // --- CUSTOM LINK INPUT VIEW ---
                <div className='flex items-center gap-2 px-1'>
                  <input
                    type='text'
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder='Paste link...'
                    className='bg-transparent border-none text-white text-sm placeholder:text-zinc-400 focus:ring-0 p-0 w-48 h-8'
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && applyLink()}
                  />
                  <button onClick={applyLink} className='hover:text-green-400'>
                    <Check className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => setShowLinkInput(false)}
                    className='hover:text-red-400'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ) : (
                // --- STANDARD FORMATTING BUTTONS ---
                <>
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={clsx(
                      "p-1.5 rounded hover:bg-zinc-700 transition",
                      editor.isActive("bold") && "bg-zinc-700",
                    )}
                  >
                    <Bold className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={clsx(
                      "p-1.5 rounded hover:bg-zinc-700 transition",
                      editor.isActive("italic") && "bg-zinc-700",
                    )}
                  >
                    <Italic className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={clsx(
                      "p-1.5 rounded hover:bg-zinc-700 transition",
                      editor.isActive("heading", { level: 2 }) && "bg-zinc-700",
                    )}
                  >
                    <Heading1 className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={clsx(
                      "p-1.5 rounded hover:bg-zinc-700 transition",
                      editor.isActive("heading", { level: 3 }) && "bg-zinc-700",
                    )}
                  >
                    <Heading2 className='w-4 h-4' />
                  </button>
                  <div className='w-[1px] h-4 bg-zinc-600 mx-1'></div>
                  <button
                    onClick={openLinkInput}
                    className={clsx(
                      "p-1.5 rounded hover:bg-zinc-700 transition",
                      editor.isActive("link") && "bg-zinc-700",
                    )}
                  >
                    <LinkIcon className='w-4 h-4' />
                  </button>
                </>
              )}
            </BubbleMenu>
          )}

          {/* Floating Side Menu */}
          <div className='mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2 sticky top-16 bg-white z-10'>
            <button
              onClick={addInlineImage}
              disabled={isUploading}
              className='p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors disabled:opacity-50'
              title='Add Image'
            >
              <ImageIcon className='w-5 h-5' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className='p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors'
              title='Quote'
            >
              <Quote className='w-5 h-5' />
            </button>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>

      {/* --- 5. PUBLISH MODAL --- */}
      {showPublishModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in-95'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold'>Finishing touches</h2>
              <button onClick={() => setShowPublishModal(false)}>
                <X className='w-6 h-6 text-zinc-400 hover:text-black' />
              </button>
            </div>

            {/* Modal Error Display */}
            {error && (
              <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'>
                {error}
              </div>
            )}

            <div className='space-y-6'>
              {/* Select Hub */}
              <div>
                <label className='block text-sm font-medium text-zinc-700 mb-2'>
                  Select a Tech Hub <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {hubs.map((hub) => (
                    <button
                      key={hub._id}
                      onClick={() => setSelectedHub(hub._id)}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm border text-left transition-all",
                        selectedHub === hub._id
                          ? "border-black bg-black text-white"
                          : "border-zinc-200 hover:border-zinc-400 text-zinc-700",
                      )}
                    >
                      {hub.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className='block text-sm font-medium text-zinc-700 mb-2'>
                  Tags (comma separated)
                </label>
                <input
                  type='text'
                  className='w-full rounded-lg border-zinc-300 focus:ring-black focus:border-black'
                  placeholder='AI, Web3, Tutorial...'
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {/* Summary */}
              <div>
                <label className='block text-sm font-medium text-zinc-700 mb-2'>
                  Short Summary
                </label>
                <textarea
                  rows={3}
                  className='w-full rounded-lg border-zinc-300 focus:ring-black focus:border-black resize-none'
                  placeholder='Briefly describe your article...'
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <Button
                  variant='ghost'
                  onClick={() => setShowPublishModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !selectedHub}
                  className='bg-green-600 hover:bg-green-700 text-white rounded-full px-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isPublishing ? (
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  ) : (
                    "Publish Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
