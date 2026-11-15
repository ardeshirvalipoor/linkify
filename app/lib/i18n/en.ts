// The English words. This file defines the keys, and every other language file
// must have exactly the same ones, which the compiler checks.
export const en = {
    language: 'Language', switchDark: 'Switch to dark mode', switchLight: 'Switch to light mode',
    intro: 'Share a file in seconds. Send up to 1 GB and pick up interrupted uploads where they left off.',
    benefitsTitle: 'Why people use Linkify', fast: 'Fast', fastDetail: 'Send files quickly',
    private: 'Private', privateDetail: 'Only signed links see it', safe: 'Safe', safeDetail: 'Password checks access; it does not encrypt the file',
    resumable: 'Resumable', resumableDetail: 'Resume interrupted uploads', simple: 'Simple', simpleDetail: 'No account required',
    reliable: 'Reliable', reliableDetail: 'Private links expire on time', aboutTitle: 'About Linkify',
    aboutDescription: 'Linkify sends files up to 1 GB directly to private storage. Uploads can resume in the same browser for up to 7 days. Optional passwords gate access but do not encrypt files; links stop working at the selected time after upload completion.',
    expiryLabel: 'Link expires after upload', hour: '1 hour', day: '1 day', week: '1 week', protect: 'Protect with password',
    passwordPlaceholder: 'Password (min 6 chars)', agree: 'I agree to the', terms: 'Terms of Service', and: 'and', privacy: 'Privacy Policy',
    dropTitle: 'Choose a file or drop it here', dropHint: 'Up to 1 GB. Resume in the same browser for up to 7 days by choosing the same file again.',
    resumeNote: 'Completed parts from an earlier attempt are still stored. Choose this same file in this browser within 7 days to continue; a part interrupted mid-transfer must be sent again.',
    upload: 'Upload', continueUpload: 'Continue upload', discard: 'Start fresh', preparingUpload: 'Preparing the upload',
    uploadQueue: 'Upload queue', queued: 'Queued', uploading: 'Uploading', paused: 'Paused', complete: 'Complete', failed: 'Failed',
    pauseUpload: 'Pause', uploadPaused: 'Upload paused. Your completed parts are saved.', timeLeft: 'About {time} left',
    uploadSuccess: '{name} uploaded successfully.', uploadFailure: '{name} could not be uploaded.', tooManyFiles: 'You can send up to {max} files at once.',
    chooseFile: 'Choose a file',
    assemblingParts: 'Putting the parts together', sendingParts: 'Sending {missing} of {total} parts',
    continuingUpload: 'Continuing an earlier upload, {sent} of {total} parts already sent',
    expirySummary: 'This link is set to expire {duration} after upload completes.', linkExpiresAt: 'Link expires {date}', copy: 'Copy', copied: 'Copied', openLink: 'Open', qrCode: 'QR', qrCodeTitle: 'Scan this QR code', close: 'Close', tryAgain: 'Try again', resumeUpload: 'Resume', sendAnother: 'Send another file',
    revokeLink: 'Revoke link', linkRevoked: 'Link revoked', confirmRevoke: 'Revoke this link?', revokeWarning: 'This share link will stop working immediately for anyone who has it. Revoke only if you are sure you no longer want this file to be accessible.', revocationNotSaved: 'This browser could not save revocation access. Revoke the link from this page before navigating away.', revocationStatusNotSaved: 'The link was revoked, but this browser could not save that status.',
    acceptBeforeSelect: 'Please accept the Terms of Service and Privacy Policy before selecting a file.',
    acceptBeforeUpload: 'Please accept the Terms of Service and Privacy Policy before uploading.',
    acceptBeforeUse: 'Check the box above to use this tool.',
    passwordRequired: 'The password is empty. Please enter a password.',
    tooLarge: '{name} is {size}. The limit is 1 GB.', passwordTooShort: 'Passwords must be at least 6 characters long.', passwordTooLong: 'Passwords must be 128 characters or fewer.', uploadFailed: 'The upload failed',
    loading: 'Loading', protectedTitle: 'Protected file', protectedPrompt: 'Enter the password to preview and download this file.',
    enterPassword: 'Password', unlock: 'Unlock', download: 'Download', preview: 'Preview', backToShare: 'Back to share link', previewUnavailable: 'Your browser cannot preview this file type. Use Download to open it.', nothingHere: 'Nothing here', linkDidNotWork: 'This link did not work',
    pleaseEnterPassword: 'Please enter the password for this file.', missingTitle: 'Nothing at this address',
    missingIntro: 'The link may have been mistyped, or the file it pointed at is gone.', sendFile: 'Send a file'
}

export type TranslationKey = keyof typeof en
export type Dictionary = Record<TranslationKey, string>
