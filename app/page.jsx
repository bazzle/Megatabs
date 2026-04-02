import Prototype from "./Prototype";
import Header from "./ui/style-library/components/Header";

export default function Home() {
	return (
		<>
			<Header headerTitle="MegaTabs" headingLevel={1} />
			<Prototype />
		</>
	);
}
