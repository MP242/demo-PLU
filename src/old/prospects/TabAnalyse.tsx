'use client'

import { useEffect, useState } from "react";
import { ProspectsItem } from "@/type"
import Collapse from "@/components/Collapse";
import Select, { StylesConfig } from 'react-select';
import MyDropzone from "@/components/MyDropzone";
import { downloadFileAudio, removeFile } from "@/action/ManageLocalFile";
import { useSession } from "next-auth/react";
import { AudioToText } from "@/action/Openai/AudioToText";
import { createMessage, listMessages } from "@/action/Openai/Messages";
import { createRun, waitRun } from "@/action/Openai/Run";
import { getAnswerbyCall, updateProspectAnswerbyCall, updateProspectTextbyCall, updateProspectThread } from "@/action/ManageProspect";
import Sentence from "./Sentence";
import { createThread } from "@/action/Openai/Threads";
import ChatBull from "@/components/ChatBull";

interface TabAnalyseProps {
    prospect: ProspectsItem | null;
}

const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const couleursStyles: StylesConfig<{ value: string; label?: string; success: boolean }, false> = {
    placeholder: (styles : any) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles : any, { data }) => ({
        ...styles,
        ...dot(data.success ? 'green' : 'red'),
    }),
};

const TabAnalyse = ({ prospect }: TabAnalyseProps) => {
    const [step, setStep] = useState<number>(0);
    const [OptionCall, setOptionCall] = useState<{ value: any, label: string, success: boolean }[]>([]);
    const [call, setCall] = useState<{ date: string, texte: { value: string, updateAt: string } } | null>(null);
    const [answer, setAnswer] = useState<{ answer: { value: string, updateAt: string } } | null>(null);
    const [isloading, setIsloading] = useState<boolean>(false);
    const { data: session } = useSession();
    function isTexte(texte: string) {
        return texte !== "" && texte !== undefined ? true : false;
    }

    useEffect(() => {
        const option = prospect?.calls.map((call) => ({ label: call.date, value: call, success: isTexte(call.texte.value) }));
        setOptionCall(option || []);
        if (call !== null) {
            setCall(option?.find((item) => item.value.date === call.date)?.value ?? null);
        }
        if (answer !== null) {
            console.log("here answer");
            const foundAnswer = prospect?.calls.find((item) => item.date === call?.date)?.answer ?? null;
            if (foundAnswer !== null) {
                setAnswer({ answer: foundAnswer });
            }
        }
    }, [prospect]);

    async function handleUploadAndConvert(file: any) {
        var ProspectThread = "";
        if (prospect?.thread === undefined || prospect?.thread === "" || prospect?.thread ===  null) {
            const Newthread: any = await createThread();
            ProspectThread = Newthread?.id ?? "";
            await updateProspectThread(prospect?._id ?? "", Newthread?.id ?? "");
        } else {
            ProspectThread = prospect?.thread;
        }
        const name = await new Promise((resolve, reject) => {
            if (file !== null) {
                const fileReader = new FileReader()
                fileReader.onabort = () => reject('file reading was aborted')
                fileReader.onerror = () => reject('file reading has failed')
                fileReader.onload = async () => {
                    const buffer = Buffer.from(fileReader.result as ArrayBuffer);
                    const base64String = buffer.toString('base64');
                    const name = `${session?.user?.email}-${new Date().toISOString()}.mp3`
                    await downloadFileAudio(base64String, name);
                    resolve(name);
                }
                fileReader.readAsArrayBuffer(file)
            }
        })
        setStep(1);
        const message: any = await AudioToText(`./public/voice/${name}`);
        await createMessage(ProspectThread, message.text);
        setStep(2);
        const run: any = await createRun(ProspectThread, process.env.ASSISTANT_ID ?? "");
        setStep(3);
        await waitRun(ProspectThread, run.id);
        setStep(4);
        const calls: any = await listMessages(ProspectThread);
        setStep(5);
        await removeFile(`./public/voice/${name}`);
        setStep(6);
        await updateProspectTextbyCall(prospect?._id ?? "", call?.date ?? "", calls.data[0].content[0].text.value);
        
    }

    const handleEditSentence = async (index: number, editedSentence: string) => {
        const updatedTexte = [...call?.texte.value.split("\n") ?? []];
        updatedTexte[index] = editedSentence;
        await updateProspectTextbyCall(prospect?._id ?? "", call?.date ?? "", updatedTexte.join("\n"));
    };

    async function handleValidate() {
        setIsloading(true);
        const res = await getAnswerbyCall(prospect?._id ?? "", call?.date ?? "");
        if (res.updateAt === call?.texte.updateAt) {
            setAnswer({ answer: res });
        } else {
            await createMessage(prospect?.thread ?? "", call?.texte.value ?? "");
            const run: any = await createRun(prospect?.thread ?? "", process.env.CRITERE_ID ?? "");
            await waitRun(prospect?.thread ?? "", run.id);
            const calls: any = await listMessages(prospect?.thread ?? "");
            await updateProspectAnswerbyCall(prospect?._id ?? "", call?.date ?? "", calls.data[0].content[0].text.value);
            setAnswer({ answer: { value: calls.data[0].content[0].text.value, updateAt: calls.data[0].created_at } });
        }
        setIsloading(false);
    }

    return (
        <div className="p-5 h-full">
            <Collapse title="Tout les calls">
                <Select
                    className="text-sm"
                    options={OptionCall}
                    placeholder="Selectionner un call"
                    styles={couleursStyles}
                    onChange={(e: any) => setCall(e?.value)}
                />
            </Collapse>
            {call &&
                <div className="h-full">
                    {call.texte.value === '' || call.texte.value === undefined ?
                        <div className="mt-2 h-96">
                            <MyDropzone handleValidataion={handleUploadAndConvert} />
                            <div className="flex flex-col">
                                <ul className="steps mt-20 self-center text-black">
                                    <li className={`step ${step >= 1 ? "step-neutral" : ""}`}>
                                        Télécharger
                                    </li>
                                    <li className={`step ${step >= 2 ? "step-neutral" : ""}`}>
                                        Transcription en texte
                                    </li>
                                    <li className={`step ${step >= 3 ? "step-neutral" : ""}`}>
                                        Envoie au bot
                                    </li>
                                    <li className={`step ${step >= 4 ? "step-neutral" : ""}`}>
                                        Attente de la réponse
                                    </li>
                                    <li className={`step ${step >= 5 ? "step-neutral" : ""}`}>
                                        Suppression du fichier
                                    </li>
                                    <li className={`step ${step >= 6 ? "step-neutral" : ""}`}>
                                        Enregistrement
                                    </li>
                                </ul>
                            </div>
                        </div>
                        : answer !== null ?
                            <div>
                                {answer.answer.value}
                                <button className="btn btn-primary" onClick={() => setAnswer(null)}>Retour</button>
                            </div>
                            :
                            <div className="container flex flex-col mt-2 text-sm h-full overflow-y-auto pb-16">
                                <div className="space-y-2">
                                    {
                                        call.texte?.value?.split("\n").map((item, index) => (
                                            <ChatBull
                                                key={index}
                                                texte={item}
                                                header={item.split(':')[0]}
                                                side={item.split(':')[0] === "Prospect" ? "left" : "right"}
                                                onEdit={(editedSentence) => handleEditSentence(index, editedSentence)} />
                                        ))
                                    }
                                </div>
                                <div className="flex justify-between my-16">
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => await updateProspectTextbyCall(prospect?._id ?? "", call?.date ?? "", "")}
                                    >
                                        Retour
                                    </button>
                                    <button
                                        disabled={isloading}
                                        className="btn btn-primary"
                                        onClick={handleValidate}
                                    >
                                        Voir la note
                                    </button>
                                </div>
                            </div>
                    }
                </div>
            }
        </div >
    )
}

export default TabAnalyse
