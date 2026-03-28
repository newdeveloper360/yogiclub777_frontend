import React from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const VoiceRecorder = ({ onRecorded, recorded }) => {
    const recorderControls = useAudioRecorder(
        {
            noiseSuppression: true,
            echoCancellation: true,
        },
        (err) => console.table(err) // onNotAllowedOrFound
    );
    return (
        <div className={`${recorderControls.isRecording ? "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 " : `relative after:block ${recorded ? "after:rounded-full after:w-2 after:h-2 after:absolute after:bg-red-800 after:top-0.5 after:right-0.5 after:z-50" : ""} `}`}>
            <AudioRecorder
                onRecordingComplete={onRecorded}
                downloadFileExtension={"mp3"}
                downloadOnSavePress={false}
                recorderControls={recorderControls}
                showVisualizer={true}
            />
        </div >
    )
}

export default VoiceRecorder