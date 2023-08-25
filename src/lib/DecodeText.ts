import he from 'he';

export default function decodeContent(content: string): string {
	const decodedContent = he.decode(content);
	return decodedContent;
}
