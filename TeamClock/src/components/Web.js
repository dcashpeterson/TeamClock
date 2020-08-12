import React from 'react';
import TeamService from '../services/TeamService';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";

import Clock from './Clock';

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component {
  constructor(props) {
    super(props);
    let token = '';
    let s = window.location.hash.indexOf('t=');
    if (s > 0) token = window.location.hash.substring(s+2);
    this.state = {
      teamService: null,
      accessToken: token,
      messages: []
    }
  }

  componentDidMount() {
    // Get the Team Service and set it in the state
    TeamService.factory().then((service) => {
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

  render() {
    if (this.state.teamService) {
      return (
        <div>
          <h1>Team clock</h1>
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
      return false;
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
      window.location.replace(
        window.location.origin + "/TeamClock/auth/web-adal/auth-start.html"
      )
      // We never return
    });
  }

  /************** END FROM ADAL SAMPLE ************/
}
export default Web;