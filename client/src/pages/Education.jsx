
import { useEffect, useState } from 'react'
import { getQualifications } from '../services/api'

// Additional details for existing qualifications.
const educationDetails = {
    'Advanced Diploma, Game Programming': [
        'Academic record to date: 9 A+ and 3 A grades',
        'Developing with Unity and HTML/CSS/JavaScript'
    ],
    'Advanced Diploma, Mechanical Engineering Technology': [
        '3.8 GPA',
        'Developing with Java, OpenGL, and OpenAL'
    ],
    'Bachelor of Science, Physics': [
        'Recipient of R.M. Hobson Award, 2007',
        "Dean's Honour Roll, 2007"
    ]
}

export default function Education() {
    const [qualifications, setQualifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function loadQualifications() {
            try {
                const data = await getQualifications()

                if (active) {
                    setQualifications(data)
                }
            } catch (err) {
                if (active) {
                    setError(err.message)
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        loadQualifications()

        return () => {
            active = false
        }
    }, [])

    return (
        <main className="education-page">
            <h2>Education</h2>

            {loading && (
                <p role="status">Loading qualifications...</p>
            )}

            {error && (
                <p className="form-error" role="alert">
                    Unable to load qualifications: {error}
                </p>
            )}

            {!loading && !error && qualifications.length === 0 && (
                <p>No qualifications are currently available.</p>
            )}

            {!loading && !error && qualifications.map(qualification => {
                const details =
                    educationDetails[qualification.title] || []

                return (
                    <section
                        key={qualification._id}
                        className="education-entry"
                    >
                        <h3>{qualification.title}</h3>

                        <p className="education-meta">
                            {qualification.description}
                        </p>

                        {qualification.completion && (
                            <p>
                                <strong>Completed: </strong>
                                {new Date(
                                    qualification.completion
                                ).toLocaleDateString()}
                            </p>
                        )}

                        {details.length > 0 && (
                            <ul>
                                {details.map(detail => (
                                    <li key={detail}>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )
            })}
        </main>
    )
}
