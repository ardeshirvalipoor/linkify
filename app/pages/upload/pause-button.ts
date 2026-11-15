// One button for Pause and Resume. When it changes state it stays in place and
// keeps its size: only its colour and its text change.

import { Button, Span } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
import styles from './pause-button.module.css'

export const PauseButton = () => {
    const base = Button('')
    base.addClass('button', 'secondary', styles.button)

    const pause = Span(t('pauseUpload'))
    const resume = Span(t('resumeUpload'))
    base.append(pause, resume)

    function setPaused(paused: boolean) {
        pause.toggleClass(styles.unseen, paused)
        resume.toggleClass(styles.unseen, !paused)
        base.toggleClass('primary', paused)
        base.toggleClass('secondary', !paused)
    }
    setPaused(false)

    return Object.assign(base, { setPaused })
}
