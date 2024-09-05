import './landing.css'
import {socialMediaList} from "@/template/landingData.ts";
const EmmsDanLabs = () => {
	const website = 'https://emmsdan.com'
	return (
		<div className="light">
		<div className="home"><br/>
			<section className="infocard" >
				<div className="info"><h1>I am EmmsDan</h1><h2>passionate about enhancing human potential...</h2>
					<div><a href={website} className="">
						<button>learn more...</button>
					</a><a href={website}  className="">
						<button className="stack">View Cool Projects</button>
					</a></div>
					<section className="social-media">
						<div className="horizontal">
							<div className="contact-us">Contact @</div>
							<div className="social-icon">
								{
									socialMediaList.map((social) => (<a href={social.url} title={`Follow EmmsDan on ${social.title}`}><img
								src={social.icon} alt={`Follow EmmsDan on ${social.title}`}/></a>))
								}
							</div>
						</div>
					</section>
				</div>
				<a href={website}  className="picture"><img src="/emmsdan-logo.png"/></a>
			</section>
		</div>
		</div>
	);
};

export default EmmsDanLabs;