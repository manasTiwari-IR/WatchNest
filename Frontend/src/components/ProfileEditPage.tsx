import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../cssfiles/ProfileEditPage.css';
import { useToaster, Message } from 'rsuite';

const ProfileEditPage: React.FC = () => {
    const toaster = useToaster();
    const apiURL = import.meta.env.VITE_api_URL;
    // Password visibility toggles
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Validation schemas
    const profileInfoSchema = Yup.object({
        fullName: Yup.string().required('Full name is required').min(3, 'Full name must be at least 3 characters').max(20, 'Full name must be at most 20 characters'),
        email: Yup.string().email('Invalid email address').required('Email is required').min(5, 'Email must be at least 5 characters').max(50, 'Email must be at most 50 characters'),
    });

    const avatarSchema = Yup.object({
        avatar: Yup.mixed()
            .required('Avatar image is required')
            .test('fileSize', 'File size must be less than 5MB', (value) => {
                if (!value) return true;
                if (value instanceof File) {
                    return value?.size <= 5 * 1024 * 1024; // 5MB
                }
            })
            .test('fileType', 'Only image files are allowed', (value) => {
                if (!value) return true;
                if (value instanceof File) {
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value?.type);
                }
            }),
    });

    const coverImageSchema = Yup.object({
        coverImage: Yup.mixed().required('Cover image is required')
            .test('fileSize', 'File size must be less than 5MB', (value) => {
                if (!value) return true;
                if (value instanceof File) {
                    return value?.size <= 5 * 1024 * 1024; // 5MB
                }
            })
            .test('fileType', 'Only image files are allowed', (value) => {
                if (!value) return true;
                if (value instanceof File) {
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value?.type);
                }
            }),
    });

    const passwordSchema = Yup.object({
        oldPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(24, 'Password must be at most 24 characters')
            .required('New password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const editProfile = async (values: any) => {
        try {
            const response = await fetch(`${apiURL}/api/v1/users/update-account`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname: values.fullName,
                    email: values.email,
                }),
                credentials: 'include',
            });
            if (response.ok) {
                //    const data = await response.json();
                //    console.log('Profile updated successfully!', data);
                toaster.push(
                    (<Message showIcon closable type="success" header="Profile Updated"
                        style={{
                            backgroundColor: "#d4edda",
                            color: "#155724",
                            borderColor: "#c3e6cb",
                        }}>
                        Profile updated successfully!
                    </Message>),
                    { placement: 'topEnd', duration: 1500 }
                );
            }
            else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toaster.push(
                (<Message showIcon closable type="error" header="Internal Server Error"
                    style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        borderColor: "#f5c6cb",
                    }}>
                    Unable to update profile. Please try again later.
                </Message>),
                { placement: 'topEnd', duration: 1500 }
            );
            throw error;
        }
    };

    const updateAvatar = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await fetch(`${apiURL}/api/v1/users/avatar`, {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                // const data = await response.json();
                // console.log('Avatar updated successfully!', data);
                toaster.push(
                    <Message type="success" showIcon>
                        Avatar updated successfully!
                    </Message>,
                    { placement: 'topEnd', duration: 2000 }
                );
            }
            else {
                throw new Error('Failed to update avatar');
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Unable to update avatar. Please try again later.
                </Message>,
                { placement: 'topEnd', duration: 2000 }
            );
            throw error;
        }
    };

    const updateCoverImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('coverImage', file);
            const response = await fetch(`${apiURL}/api/v1/users/cover-image`, {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                // const data = await response.json();
                // console.log('Cover image updated successfully!', data);
                toaster.push(
                    <Message type="success" showIcon>
                        Cover image updated successfully!
                    </Message>,
                    { placement: 'topEnd', duration: 2000 }
                );
            }
            else {
                throw new Error('Failed to update cover image');
            }
        }
        catch (error) {
            console.error('Error updating cover image:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Unable to update cover image. Please try again later.
                </Message>,
                { placement: 'topEnd', duration: 2000 }
            );
            throw error;
        }
    };

    const updatePassword = async (values: { oldPassword: string; newPassword: string }) => {
        try {
            const response = await fetch(`${apiURL}/api/v1/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                // const data = await response.json();
                // console.log('Password updated successfully!', data);
                toaster.push(
                    <Message type="success" showIcon>
                        Password updated successfully!
                    </Message>,
                    { placement: 'topEnd', duration: 2000 }
                );
            }
            else {
                throw new Error('Failed to update password');
            }
        }
        catch (error) {
            console.error('Error updating password:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Unable to update password. Please try again later.
                </Message>,
                { placement: 'topEnd', duration: 2000 }
            );
            throw error;
        }
    };

    return (
        <section className="profile-edit-container">
            <h1 className="profile-edit-title">Edit Your Profile</h1>

            <div className="profile-edit-form-container">
                <h2>Personal Information</h2>
                <Formik
                    initialValues={{ fullName: '', email: '' }}
                    validationSchema={profileInfoSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        // console.log('Profile info update:', values);
                        await editProfile(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="profile-edit-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <Field type="text" minLength={2} maxLength={20} id="fullName" name="fullName" className="form-control" />
                                <ErrorMessage name="fullName" component="div" className="error-message" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <Field type="email" id="email" minLength={5} maxLength={50} name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="error-message" />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                Update Profile Info
                            </button>
                        </Form>
                    )}
                </Formik>

                <h2>Avatar Image</h2>
                <Formik
                    initialValues={{ avatar: undefined as unknown as File }}
                    validationSchema={avatarSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        console.log('Avatar update:', values);
                        await updateAvatar(values.avatar);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="profile-edit-form">
                            <div className="form-group">
                                <label htmlFor="avatar">Upload Avatar</label>
                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png"
                                    className="form-control file-input"
                                    onChange={(event) => {
                                        if (event.currentTarget.files?.[0]) {
                                            setFieldValue('avatar', event.currentTarget.files[0]);
                                        }
                                        else {
                                            setFieldValue('avatar', undefined);
                                        }
                                    }}
                                />
                                <ErrorMessage name="avatar" component="div" className="error-message" />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                Update Avatar
                            </button>
                        </Form>
                    )}
                </Formik>

                <h2>Profile Cover Image</h2>
                <Formik
                    initialValues={{ coverImage: undefined as unknown as File }}
                    validationSchema={coverImageSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        // console.log('Cover image update:', values);
                        // console.log('Updating cover image...', values.coverImage);
                        await updateCoverImage(values.coverImage);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="profile-edit-form">
                            <div className="form-group">
                                <label htmlFor="coverImage">Upload Cover Image</label>
                                <input
                                    id="coverImage"
                                    name="coverImage"
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png"
                                    className="form-control file-input"
                                    onChange={(event) => {
                                        if (event.currentTarget.files?.[0]) {
                                            setFieldValue('coverImage', event.currentTarget.files[0]);
                                        }
                                        else {
                                            setFieldValue('coverImage', undefined);
                                        }
                                    }}
                                />
                                <ErrorMessage name="coverImage" component="div" className="error-message" />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                Update Cover Image
                            </button>
                        </Form>
                    )}
                </Formik>

                <h2>Change Password</h2>
                <Formik
                    initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
                    validationSchema={passwordSchema}
                    onSubmit={async (values, { resetForm, setSubmitting }) => {
                        await updatePassword(values);
                        resetForm();
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="profile-edit-form">
                            <div className="form-group">
                                <label htmlFor="oldPassword">Current Password</label>
                                <div className="password-field">
                                    <Field
                                        type={showOldPassword ? "text" : "password"}
                                        id="oldPassword"
                                        name="oldPassword"
                                        className="form-control"
                                        minLength={6}
                                        maxLength={24}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showOldPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage name="oldPassword" component="div" className="error-message" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-field">
                                    <Field
                                        type={showNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        className="form-control"
                                        minLength={6}
                                        maxLength={24}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage name="newPassword" component="div" className="error-message" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="password-field">
                                    <Field
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-control"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                Update Password
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
};

export default ProfileEditPage;