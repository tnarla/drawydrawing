import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import socket from '../../../socket';

interface Props {
    onRequestPassword(): void;
}

export default function SocketEvents(props: Props) {
    const history = useHistory();
    const match = useRouteMatch<{ shortId?: string }>();

    useEffect(() => {
        if (match.params.shortId) {
            socket.emit('join', match.params.shortId);
        }
    }, [match.params.shortId]);

    useEffect(() => {
        const handleJoined = (room: string) => {
            history.push(room);
        };

        socket.on('joined', handleJoined);
        socket.on('requestPassword', props.onRequestPassword);
        return () => {
            socket.off('joined', handleJoined);
            socket.off('requestPassword', props.onRequestPassword);
        }
    }, []);

    return null;
}