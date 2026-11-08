
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import {
    getCurrentUser,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getQualifications,
    createQualification,
    updateQualification,
    deleteQualification,
    getContacts,
    createContact,
    updateContact,
    deleteContact
} from '../services/api'

// Configuration for each collection.
const resources = [
    {
        name: 'Projects',
        getAll: getProjects,
        create: createProject,
        update: updateProject,
        remove: deleteProject,
        fields: [
            { name: 'title', label: 'Title', required: true },
            { name: 'firstName', label: 'First Name', required: true },
            { name: 'lastName', label: 'Last Name', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'completion', label: 'Completion Date', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]
    },
    {
        name: 'Qualifications',
        getAll: getQualifications,
        create: createQualification,
        update: updateQualification,
        remove: deleteQualification,
        fields: [
            { name: 'title', label: 'Title', required: true },
            { name: 'firstName', label: 'First Name', required: true },
            { name: 'lastName', label: 'Last Name', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'completion', label: 'Completion Date', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]
    },
    {
        name: 'Contacts',
        getAll: getContacts,
        create: createContact,
        update: updateContact,
        remove: deleteContact,
        fields: [
            { name: 'firstName', label: 'First Name', required: true },
            { name: 'lastName', label: 'Last Name', required: true },
            { name: 'contactNumber', label: 'Contact Number', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: true }
        ]
    }
]

// Create a blank form from the model fields.
function emptyForm(fields) {
    return Object.fromEntries(
        fields.map(field => [field.name, ''])
    )
}

// Reusable CRUD interface.
function ResourceManager({ config }) {
    const [records, setRecords] = useState([])
    const [formData, setFormData] = useState(
        () => emptyForm(config.fields)
    )
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        let active = true

        async function load() {
            try {
                const data = await config.getAll()
                if (active) setRecords(data)
            } catch (err) {
                if (active) setError(err.message)
            } finally {
                if (active) setLoading(false)
            }
        }

        load()

        return () => {
            active = false
        }
    }, [config])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData(previous => ({
            ...previous,
            [name]: value
        }))
    }

    function resetForm() {
        setFormData(emptyForm(config.fields))
        setEditingId(null)
    }

    function startEdit(record) {
        const values = emptyForm(config.fields)

        for (const field of config.fields) {
            const value = record[field.name]

            if (field.type === 'date') {
                values[field.name] = value
                    ? String(value).slice(0, 10)
                    : ''
            } else {
                values[field.name] = value ?? ''
            }
        }

        setFormData(values)
        setEditingId(record._id)
        setError('')
        setSuccess('')
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        // Don't send empty optional date fields to Mongoose.
        const payload = { ...formData }

        for (const field of config.fields) {
            if (field.type === 'date' && !payload[field.name]) {
                payload[field.name] = null
            }
        }

        try {
            if (editingId) {
                await config.update(editingId, payload)
                setSuccess(`${config.name} record updated successfully.`)
            } else {
                await config.create(payload)
                setSuccess(`${config.name} record created successfully.`)
            }

            const updated = await config.getAll()
            setRecords(updated)
            resetForm()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(record) {
        const label = record.title ||
            `${record.firstName} ${record.lastName}`

        if (!window.confirm(`Delete "${label}"?`)) {
            return
        }

        setDeletingId(record._id)
        setError('')
        setSuccess('')

        try {
            await config.remove(record._id)
            setRecords(previous =>
                previous.filter(item => item._id !== record._id)
            )

            if (editingId === record._id) {
                resetForm()
            }

            setSuccess(`${config.name} record deleted successfully.`)
        } catch (err) {
            setError(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <section className="admin-section">
            <h3>Manage {config.name}</h3>

            {loading ? (
                <p role="status">Loading {config.name.toLowerCase()}...</p>
            ) : (
                <>
                    <h4>Existing Records ({records.length})</h4>

                    {records.length === 0 && (
                        <p>No records found.</p>
                    )}

                    <div className="admin-records">
                        {records.map(record => (
                            <article
                                key={record._id}
                                className="admin-record"
                            >
                                <div>
                                    <strong>
                                        {record.title ||
                                            `${record.firstName} ${record.lastName}`}
                                    </strong>

                                    {record.description && (
                                        <p>{record.description}</p>
                                    )}

                                    {record.message && (
                                        <p>{record.message}</p>
                                    )}

                                    {record.email && (
                                        <small>{record.email}</small>
                                    )}
                                </div>

                                <div className="admin-actions">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(record)}
                                        disabled={saving || deletingId !== null}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-delete"
                                        onClick={() => handleDelete(record)}
                                        disabled={saving || deletingId !== null}
                                    >
                                        {deletingId === record._id
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <h4>
                {editingId ? 'Edit Record' : 'Create New Record'}
            </h4>

            <form className="admin-form" onSubmit={handleSubmit}>
                {config.fields.map(field => (
                    <div className="form-group" key={field.name}>
                        <label htmlFor={`${config.name}-${field.name}`}>
                            {field.label}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                id={`${config.name}-${field.name}`}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                rows={4}
                                required={field.required}
                                minLength={
                                    field.name === 'message' ? 10 : undefined
                                }
                            />
                        ) : (
                            <input
                                id={`${config.name}-${field.name}`}
                                name={field.name}
                                type={field.type || 'text'}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}

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

                <div className="admin-actions">
                    <button type="submit" disabled={saving || loading}>
                        {saving
                            ? 'Saving...'
                            : editingId ? 'Save Changes' : 'Create Record'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel Editing
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}

// Verify the admin account against the backend before displaying data.
export default function AdminDashboard() {
    const { user } = useAuth()
    const [verified, setVerified] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        let active = true

        async function verifyAdmin() {
            try {
                const currentUser = await getCurrentUser()

                if (active) {
                    setVerified(currentUser.role === 'admin')
                }
            } catch {
                if (active) setVerified(false)
            } finally {
                if (active) setChecking(false)
            }
        }

        verifyAdmin()

        return () => {
            active = false
        }
    }, [user?.id])

    if (checking) {
        return (
            <main className="admin-page">
                <p role="status">Verifying administrator access...</p>
            </main>
        )
    }

    if (!verified) {
        return (
            <main className="admin-page">
                <h2>Access Denied</h2>
                <p>Administrator privileges are required.</p>
                <Link to="/signin">Sign In</Link>
            </main>
        )
    }

    return (
        <main className="admin-page">
            <h2>Administrator Dashboard</h2>

            <p>
                Create, view, edit, and delete portfolio records.
                Changes are saved to MongoDB.
            </p>

            {resources.map(config => (
                <ResourceManager
                    key={config.name}
                    config={config}
                />
            ))}
        </main>
    )
}
