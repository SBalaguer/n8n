import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

// import {
// 	copperApiRequest,
// 	getAutomaticSecret,
// } from './GenericFunctions';

export class CopperRead implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Copper Read',
		name: 'copperRead',
		icon: 'file:copper.png',
		group: ['regular'],
		version: 1,
		description: 'Reac Copper Opportunities',
		defaults: {
			name: 'Copper Opportunities',
			color: '#ff2564',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'copperApi',
				required: true,
			},
		],
		// webhooks: [
		// 	{
		// 		name: 'default',
		// 		httpMethod: 'POST',
		// 		responseMode: 'onReceived',
		// 		path: 'webhook',
		// 	},
		// ],
		properties: [
			{
				displayName: 'Copper ID',
				name: 'id',
				type: 'string',
				required: true,
				default: '',
				// options: [
				// 	{
				// 		name: 'Company',
				// 		value: 'company',
				// 	},
				// 	{
				// 		name: 'Lead',
				// 		value: 'lead',
				// 	},
				// 	{
				// 		name: 'Opportunity',
				// 		value: 'opportunity',
				// 	},
				// 	{
				// 		name: 'Person',
				// 		value: 'person',
				// 	},
				// 	{
				// 		name: 'Project',
				// 		value: 'project',
				// 	},
				// 	{
				// 		name: 'Task',
				// 		value: 'task',
				// 	},
				// ],
				description: 'The Oppportunity ID to search for',
			},
			// {
			// 	displayName: 'Event',
			// 	name: 'event',
			// 	type: 'options',
			// 	required: true,
			// 	default: '',
			// 	options: [
			// 		{
			// 			name: 'Delete',
			// 			value: 'delete',
			// 			description: 'An existing record is removed',
			// 		},
			// 		{
			// 			name: 'New',
			// 			value: 'new',
			// 			description: 'A new record is created',
			// 		},
			// 		{
			// 			name: 'Update',
			// 			value: 'update',
			// 			description: 'Any field in the existing entity record is changed',
			// 		},
			// 	],
			// 	description: 'The event to listen to.',
			// },
		],
	};
	// @ts-ignore

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = this.getCredentials('copperApi');
        const id = this.getNodeParameter('id',0) as string;

        if(!credentials){
            return []
        }
        
        const options: OptionsWithUri = {
            headers: {
                'X-PW-AccessToken': credentials.apiKey,
			    'X-PW-Application': 'developer_api',
			    'X-PW-UserEmail': credentials.email,
			    'Content-Type': 'application/json',
		    },
            method: 'GET',
            uri: `https://api.prosperworks.com/developer_api/v1/opportunities/${id}`,
            json: true,
        };

        let response;

        try {
            response =  await this.helpers.request!(options);
            console.log(response)
        } catch (error) {
            let errorMessage = error.message;
            if (error.response.body && error.response.body.message) {
                errorMessage = error.response.body.message;
            }
            throw new Error('Copper Error: ' + errorMessage);
        }


		return [this.helpers.returnJsonArray(response)]
	}
}
