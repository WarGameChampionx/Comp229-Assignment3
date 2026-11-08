
import { useEffect, useState } from 'react'
import { getProjects } from '../services/api'

import factoryImage from '../assets/Project1.png'
import gardensImage from '../assets/Project2.png'
import climbTheTowerImage from '../assets/Project3.png'

// Additional presentation details for existing portfolio projects.
const projectDetails = {
    'Factory Through The Ages': {
        image: factoryImage,
        role: 'Independent Game Developer',
        outcome: 'Completed and released as a playable HTML5 browser game on itch.io.',
        link: 'https://wargamechampion.itch.io/factory-through-the-ages'
    },
    'Gardens of Music': {
        image: gardensImage,
        role: 'Independent Game Developer',
        outcome: 'Developed into a downloadable simulation focused on procedural audio, creativity, and experimentation.',
        link: 'https://wargamechampion.itch.io/gardens-of-music'
    },
    'HM4: Climb the Tower': {
        image: climbTheTowerImage,
        role: 'Independent Game Developer',
        outcome: 'Produced and released a playable prototype featuring combat, progression, and unlockable content.',
        link: 'https://wargamechampion.itch.io/heroes-and-monsters-4'
    }
}

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function loadProjects() {
            try {
                const data = await getProjects()

                if (active) {
                    setProjects(data)
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

        loadProjects()

        return () => {
            active = false
        }
    }, [])

    return (
        <main className="projects-page">
            <h2>Projects</h2>
            <p className="projects-intro">
                Here are some games I designed and developed.
            </p>

            {loading && <p role="status">Loading projects...</p>}

            {error && (
                <p className="form-error" role="alert">
                    Unable to load projects: {error}
                </p>
            )}

            {!loading && !error && projects.length === 0 && (
                <p>No projects are currently available.</p>
            )}

            <div className="projects-list">
                {projects.map(project => {
                    const details = projectDetails[project.title] || {}

                    return (
                        <article
                            key={project._id}
                            className="project-card"
                        >
                            {details.image && (
                                <img
                                    src={details.image}
                                    alt={project.title}
                                    className="project-image"
                                />
                            )}

                            <div className="project-info">
                                <h3>{project.title}</h3>

                                <p>{project.description}</p>

                                {project.completion && (
                                    <p>
                                        <strong>Completion: </strong>
                                        {new Date(
                                            project.completion
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                                {details.role && (
                                    <p>
                                        <strong>Role: </strong>
                                        {details.role}
                                    </p>
                                )}

                                {details.outcome && (
                                    <p>
                                        <strong>Outcome: </strong>
                                        {details.outcome}
                                    </p>
                                )}

                                {details.link && (
                                    <a
                                        href={details.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View on itch.io
                                    </a>
                                )}
                            </div>
                        </article>
                    )
                })}
            </div>
        </main>
    )
}
