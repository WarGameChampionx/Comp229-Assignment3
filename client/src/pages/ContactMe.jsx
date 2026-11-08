
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createContact } from '../services/api'

export default function ContactMe() {
    const navigate = useNavigate()

    // Contact form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        message: ''
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    // Update form fields as the visitor types.
    function handleChange(event) {
        const { name, value } = event.target

        setFormData(previous => ({
            ...previous,
            [name]: value
        }))
    }

    // Validate and submit the form to Express.
    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setSuccess('')

        const phonePattern = /^[0-9+\-()\s]{7,20}$/
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.contactNumber.trim() ||
            !formData.email.trim() ||
            !formData.message.trim()
        ) {
            setError('Please complete all fields.')
            return
        }

        if (!phonePattern.test(formData.contactNumber)) {
            setError('Please enter a valid contact number.')
            return
        }

        if (!emailPattern.test(formData.email)) {
            setError('Please enter a valid email address.')
            return
        }

        if (formData.message.trim().length < 10) {
            setError('Please enter a message of at least 10 characters.')
            return
        }

        setLoading(true)

        try {
            // Save the contact submission in MongoDB.
            await createContact(formData)

            setSuccess('Your message was sent successfully!')

            // Clear the form.
            setFormData({
                firstName: '',
                lastName: '',
                contactNumber: '',
                email: '',
                message: ''
            })

        } catch (err) {
            setError(err.message || 'Unable to send your message.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="contact-page">
            <h2>Contact Me</h2>

            <p>
                Have a question or want to get in touch?
                Fill out the form below.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            maxLength={50}
                            autoComplete="given-name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            maxLength={50}
                            autoComplete="family-name"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        maxLength={20}
                        autoComplete="tel"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        maxLength={100}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={7}
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={1000}
                        minLength={10}
                        required
                    />
                </div>

                {error && (
                    <p className="form-error" role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="form-success" role="status">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    className="contact-submit"
                    disabled={loading}
                >
                    {loading ? 'Sending Message...' : 'Send Message'}
                </button>

                {success && (
                    <button
                        type="button"
                        className="contact-submit"
                        onClick={() => navigate('/')}
                        style={{ marginLeft: '10px' }}
                    >
                        Return Home
                    </button>
                )}
            </form>
        </main>
    )
}
