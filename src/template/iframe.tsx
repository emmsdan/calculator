export const IframePage = ({ url }: { url: string}) =>{
	return <iframe src={url} style={{width:'100vw', height:'100vh'}} />;
}
