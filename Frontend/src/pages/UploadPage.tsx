import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToaster, Message } from 'rsuite';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import "../cssfiles/UploadStyles.css";
import Navbar from '../components/Navbar.tsx';
import useCustomHooks from '../functions/CustomHook.ts';
import { useSelector } from 'react-redux';

// Interface for the form data
interface UploadFormData {
  title: string;
  description: string;
  videoFile: File | null | undefined;
  thumbnailImage: File | null | undefined;
}

// Validation schema
const schema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters').max(100, 'Title must be at most 100 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be at most 500 characters'),
  videoFile: yup.mixed<File>()
    .required('Video is required')
    .test('fileSize', 'File size must be less than 50MB', (value) => {
      if (!value) return true;
      return value.size <= 50 * 1024 * 1024; // 50MB
    })
    .test('fileType', 'Only video files are allowed', (value) => {
      if (!value) return true;
      return ['video/mp4', 'video/webm', 'video/ogg'].includes(value.type);
    }),
  thumbnailImage: yup.mixed<File>()
    .required('Thumbnail is required')
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }),
});

const UploadPage: React.FC = () => {
  const { verifyRefreshToken } = useCustomHooks();
  const verifyRefreshTokenResponse: boolean = useSelector((state: any) => state.verifyRefreshToken.val);
  console.log("verifyRefreshTokenResponse: ", verifyRefreshTokenResponse);

  useEffect(() => {
    //  console.log("useEffect called in Dashboard");
    if (!verifyRefreshTokenResponse) {
      console.log("Calling VerifyRefreshToken function");
      verifyRefreshToken("/login");
    }
  }, []);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFilename, setVideoFilename] = useState<string | null>(null);
  const [thumbnailFilename, setThumbnailFilename] = useState<string | null>(null);

  const navigate = useNavigate();
  const toaster = useToaster();

  const initialValues: UploadFormData = {
    title: '',
    description: '',
    videoFile: undefined,
    thumbnailImage: undefined,
  };

  // Handle form submission
  const apiURL = import.meta.env.VITE_api_URL;
  const onSubmit = async (values: UploadFormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const formdata = new FormData();
      formdata.append('title', values.title);
      formdata.append('description', values.description);
      formdata.append('videoFile', values.videoFile as File);
      formdata.append('thumbnail', values.thumbnailImage as File);
      console.log("FormData entries:");
      for (const pair of formdata.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      console.log("Submitting form data to API...");
      const response = await fetch(`${apiURL}/api/v1/videos/upload`, {
        method: "POST",
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        body: formdata,
        credentials: "include", // Include cookies in the request
      });
      console.log("response: ", response);
      console.log("Response Status:", response.status);
      if (response.status === 201 || response.status === 200) {
        const responseData = await response.json();
        console.log("Video uploaded successfully:", responseData);
        toaster.push(
          <Message type="success" showIcon>
            Video uploaded successfully!
          </Message>,
          { placement: 'topCenter', duration: 2000 }
        );
        navigate("/dashboard");
      }
      else {
        console.error("Failed to upload video:", response.statusText);
        toaster.push(
          <Message type="error" showIcon>
            Error uploading video. Please try again.
          </Message>,
          { placement: 'topCenter', duration: 2000 }
        );
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toaster.push(
        <Message type="error" showIcon>
          Error uploading video. Please try again.
        </Message>,
        { placement: 'topCenter', duration: 2000 }
      );
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-container">
      <Navbar opendrawer={false} />
      <div className="form-container">
        <h2 className="form-title">Upload New Video</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className='uploadform' >
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" id="title-video-upload" name="title" minLength={3} maxLength={100} />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field as="textarea" id="description-video-upload" name="description" rows={4} minLength={10} maxLength={500} />
                <ErrorMessage name="description" component="div" className="error" />
              </div>

              <div className="video_thumbnail">
                {/* Thumbnail */}
                <div className="form-group form-group-thumbnail">
                  <label>Thumbnail Image</label>
                  <div className="file-input-container">
                    <span className="file-input-label">Select Image</span>
                    <input
                      id="thumbnailImage"
                      name="thumbnailImage"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const file = event.currentTarget.files?.[0] || null;
                        if (file) {
                          setThumbnailFilename(`${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
                          setThumbnailPreview(URL.createObjectURL(file));
                        } else {
                          setThumbnailFilename(null);
                          setThumbnailPreview(null);
                        }
                        setFieldValue('thumbnailImage', file);
                      }}
                    />
                  </div>
                  <ErrorMessage name="thumbnailImage" component="div" className="error" />
                  <p className="video-thumbnail-file-info" hidden={!thumbnailFilename} >{thumbnailFilename}</p>
                  <div className="thumbnail-preview" hidden={!thumbnailPreview}>
                    {/* <span className="thumbnail-preview-label">Thumbnail Preview:</span> */}
                    {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" />}
                  </div>
                </div>

                {/* Video File */}
                <div className="form-group form-group-video">
                  <label>Upload Video</label>
                  <div className="file-input-container">
                    <span className="file-input-label">Select Video</span>
                    <input
                      id="videoFile"
                      name="videoFile"
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const file = event.currentTarget.files?.[0] || null;
                        if (file) {
                          setVideoFilename(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
                          setVideoPreview(URL.createObjectURL(file));
                        } else {
                          setVideoFilename(null);
                          setVideoPreview(null);
                        }
                        setFieldValue('videoFile', file);
                      }}
                    />
                  </div>
                  <ErrorMessage name="videoFile" component="div" className="error" />

                  <p className="video-thumbnail-file-info" hidden={!videoFilename} >{videoFilename}</p>
                  <div className="video-preview" hidden={!videoPreview}>
                    {/* <span className="thumbnail-preview-label">Thumbnail Preview:</span> */}
                    {videoPreview && <video src={videoPreview} controls muted />}
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner">⟳</span>
                    Uploading...
                  </>
                ) : 'Upload Video'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadPage;
