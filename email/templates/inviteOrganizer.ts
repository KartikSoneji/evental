import Prisma from '@prisma/client';
import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import { NextkitError } from 'nextkit';

import { sendEmail } from '../../utils/email';
import { GenerateTemplateArgs } from '../generateTemplates';

type InviteOrganizerTemplateArgs = {
	inviteLink: string;
	inviterName: string;
	eventName: string;
};

export const template = `
<mjml>
    <mj-head>
        <mj-font name="Inter"
                 href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
        <mj-style inline="inline">
            .link-button {
                text-decoration: none;
                background-color: #0066FF;
                color: #ffffff;
                padding: 8px 15px;
                border-radius: 5px
            }
        </mj-style>
    </mj-head>

    <mj-body>
        <mj-section>
            <mj-column>
                <mj-image width="150px" src="https://cdn.evental.app/images/logo-text.png"/>

                <mj-divider border-color="#CDCDCD" border-width='3px'/>

                <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">Organizer Invite for {{eventName}}
                </mj-text>

                <mj-text padding-bottom="30px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">You have received an invitation to organize {{eventName}} by {{inviterName}}.
                </mj-text>

                <mj-text font-size="16px" color="#5C41FF" font-family="Inter, Roboto, Arial">
                    <a class="link-button" href="{{inviteLink}}" target="_blank">Accept Invite</a>
                </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`;

const htmlOutput = mjml2html(template);

const text = convert(htmlOutput.html, {
	wordwrap: 130
});

export const inviteOrganizer: GenerateTemplateArgs = {
	textPart: text,
	htmlPart: htmlOutput.html,
	subjectPart: 'Organizer Invitation',
	templateName: 'OrganizerInvite'
};

type SendInviteOrganizerArgs = {
	toAddresses: string[];
	inviteCode: string;
	event: Prisma.Event;
	inviterName: string;
};

export const sendOrganizerInvite = async (args: SendInviteOrganizerArgs) => {
	const { toAddresses, inviteCode, inviterName, event } = args;

	if (toAddresses.length === 0) {
		throw new NextkitError(400, 'No recipients specified');
	}

	const templateData: InviteOrganizerTemplateArgs = {
		inviteLink: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${
			event.slug
		}/invites/organizer?code=${inviteCode}`,
		eventName: event.name,
		inviterName
	};

	const params: SESV2.SendEmailRequest = {
		FromEmailAddress: `"Evental" <messages@evental.app>`,
		ReplyToAddresses: ['"Evental Support" <support@evental.app>'],
		Destination: {
			ToAddresses: toAddresses
		},
		Content: {
			Template: {
				TemplateData: JSON.stringify(templateData),
				TemplateName: inviteOrganizer.templateName
			}
		}
	};

	await sendEmail(params).catch((err) => {
		throw new NextkitError(500, err);
	});
};
