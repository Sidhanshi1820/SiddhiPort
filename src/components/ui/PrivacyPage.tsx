import { LegalPage } from './LegalPage'
import { profile } from '../../data/portfolio'

export function PrivacyPage() {
  return (
    <LegalPage eyebrow="// legal · privacy" title="Privacy Policy" updated="September 27, 2026">
      <p>
        This website (the "site") is a personal portfolio for {profile.name}. This
        policy explains, in plain terms, what happens to data when you visit. The
        short version: the site collects no personal data itself.
      </p>

      <h2>What I collect</h2>
      <p>Nothing, directly. The site has no accounts, no sign-up forms, no comment
      sections, no contact form, and no analytics or tracking scripts of any kind.
      No cookies are set by this site.</p>

      <h2>Standard server logs</h2>
      <p>Like essentially every website, the hosting provider (Render) automatically
      records technical request data such as your IP address, browser type, and the
      time of each request. This exists for security and abuse prevention, is kept by
      the provider under its own retention policy, and is not used to profile you or
      identify you personally. See <a href="https://render.com/privacy" rel="noreferrer">Render's privacy policy</a>
      for details.</p>

      <h2>Third-party content</h2>
      <ul>
        <li><strong>Fonts:</strong> typefaces are loaded from Google Fonts. Google
        receives the request for those font files.</li>
        <li><strong>External links:</strong> links to GitHub, LinkedIn, and email open
        services operated by third parties. Once you follow them, their own policies
        apply, not this one.</li>
      </ul>

      <h2>Contacting me</h2>
      <p>The only way the site offers to reach me is the email link, which opens your
      own mail client. If you email me, I will have your email address and use it only
      to reply to you. To have a message of yours deleted, email me at{' '}
      <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>

      <h2>Changes</h2>
      <p>If this policy changes, the updated date above will change with it.</p>
    </LegalPage>
  )
}
