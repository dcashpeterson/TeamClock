import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamService from '../services/TeamService';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";

import Clock from './Clock';

/**
 * The tab UI used when running in Teams
 */
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      teamService: null,
      accessToken: '',
      messages: []
    }
  }

  componentDidMount() {
    // Get the Teams context and set it in the state
    if (microsoftTeams) {
      microsoftTeams.getContext((context, error) => {
        if (context) {
          this.setState({
            context: context
          });
          // Get the Team Service and set it in the state
          TeamService.factory(context).then((service) => {
            this.setState({
              teamService: service
            });
          });
          // Set up the Graph service
          this.msGraphClient = MicrosoftGraphClient.Client.init({
            authProvider: async (done) => {
              if (!this.state.accessToken) {
                const token = await this.getAccessToken();
                this.setState({
                  accessToken: token
                });
              }
              done(null, this.state.accessToken);
            }
          });
        }
      });
    }
  }

  render() {

    if (this.state.context && this.state.teamService) {
      // let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";
      return (
        <div>
          <Clock teamService={this.state.teamService} />
          <button onClick={this.handleGetMyMessagesOnClick}>Get My Messages</button>
          {this.state.messages.map(message => (
            <p>
              {message.receivedDateTime} --- {message.subject}
            </p>
          ))
          }
        </div>
      );
    } else {
      return null;
    }

  }

  /************* FROM ADAL SAMPLE *******************/
  handleGetMyMessagesOnClick = async (event) => {
    await this.getMessages();
  }

  async getMessages(promptConsent = false) {
    if (promptConsent || this.state.accessToken === "") {
      await this.signin(promptConsent);
    }

    this.msGraphClient
      .api("me/mailFolders/inbox/messages")
      .select(["receivedDateTime", "subject"])
      .top(15)
      .get(async (error, rawMessages, rawResponse) => {
        if (!error) {
          this.setState(Object.assign({}, this.state, {
            messages: rawMessages.value
          }));
          Promise.resolve();
        } else {
          console.error("graph error", error);
          // re-sign in but this time force consent
          await this.getMessages(true);
        }
      });
  }

  async signin(promptConsent = false) {
    const token = await this.getAccessToken(promptConsent);

    this.setState({
      accessToken: token
    });

    Promise.resolve();
  }

  async getAccessToken(promptConsent = false) {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.authenticate({
        url: window.location.origin + "/TeamClock/auth/teams-adal/auth-start.html",
        width: 600,
        height: 535,
        successCallback: (accessToken) => {
          resolve(accessToken);
        },
        failureCallback: (reason) => {
          reject(reason);
        }
      });
    });
  }

  /************** END FROM ADAL SAMPLE ************/

}
export default Tab;