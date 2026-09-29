import { LegalPage } from './LegalPage'
import { profile } from '../../data/portfolio'

export function TermsPage() {
  return (
    <LegalPage eyebrow="// legal · terms" title="Terms of Use" updated="September 27, 2026">
      <p>
        These terms govern your use of this website, the personal portfolio of{' '}
        {profile.name}. By using the site you agree to them.
      </p>

      <h2>The site itself</h2>
      <p>The site is a showcase of my work. It is provided free of charge, as is,
      and availability is not guaranteed. Features, content, and design may change
      or be removed at any time.</p>

      <h2>Content and ownership</h2>
      <p>Descriptions, project write-ups, and the design of the site are owned by me
      unless stated otherwise. The underlying code is open source in the public{' '}
      <a href="https://github.com/Sidhanshi1820/SiddhiPort" rel="noreferrer">GitHub repository</a>{' '}
      under the license stated there. You may not present the site or its content as
      your own work.</p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt, overload, or gain unauthorized access to the
        site or its hosting.</li>
        <li>Do not scrape or republish the content in bulk without permission.</li>
        <li>Do not use the contact email for spam or unsolicited commercial
        solicitations.</li>
      </ul>

      <h2>No professional advice</h2>
      <p>Project descriptions and write-ups are shared for informational purposes.
      They are not security consulting, and nothing here creates a client or
      professional relationship.</p>

      <h2>Disclaimers and liability</h2>
      <p>The site and its content are provided without warranties of any kind, to
      the extent permitted by law. To the maximum extent permitted by applicable
      law, I am not liable for any indirect or consequential loss arising from your
      use of the site or reliance on its content.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Disputes will be handled in
      the courts of Gautam Buddha Nagar, Uttar Pradesh, unless applicable law gives
      you a mandatory local forum.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>
    </LegalPage>
  )
}
