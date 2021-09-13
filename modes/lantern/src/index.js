import toolbarButtons from './toolbarButtons.js';
import { hotkeys, DicomMetadataStore } from '@ohif/core';

const ohif = {
  layout: 'org.ohif.default.layoutTemplateModule.viewerLayout',
  sopClassHandler: 'org.ohif.default.sopClassHandlerModule.stack',
  hangingProtocols: 'org.ohif.default.hangingProtocolModule.default',
};

const tracked = {
  measurements: 'org.ohif.measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: 'org.ohif.measurement-tracking.panelModule.seriesList',
  viewport: 'org.ohif.measurement-tracking.viewportModule.cornerstone-tracked',
};

const dicomsr = {
  sopClassHandler: 'org.ohif.dicom-sr.sopClassHandlerModule.dicom-sr',
  viewport: 'org.ohif.dicom-sr.viewportModule.dicom-sr',
};

export default function mode({ modeConfiguration }) {
  return {
    // TODO: We're using this as a route segment
    // We should not be.
    id: 'lantern-viewer',
    displayName: 'Basic Lantern Viewer',
    /**
     * Lifecycle hooks
     */
    onModeEnter: ({ servicesManager, extensionManager }) => {
      // Note: If tool's aren't initialized, this doesn't have viewport/tools
      // to "set active". This is mostly for the toolbar UI state?
      // Could update tool manager to be always persistent, and to set state
      // on load?
      const { ToolBarService } = servicesManager.services;
      const interaction = {
        groupId: 'primary',
        itemId: 'Wwwc',
        interactionType: 'tool',
        commandOptions: undefined,
      };

      ToolBarService.recordInteraction(interaction);

      ToolBarService.init(extensionManager);
      ToolBarService.addButtons(toolbarButtons);
      ToolBarService.createButtonSection('primary', [
        'MeasurementTools',
        'Zoom',
        'WindowLevel',
        'Pan',
        'Capture',
        'Layout',
        'MoreTools',
      ]);
    },
    onModeExit: () => {},
    validationTags: {
      study: [],
      series: [],
    },
    isValidMode: (studyTags, seriesTags) => {
      // All series are welcome in this mode!
      return true;
    },
    // onModeEnter: ({ servicesManager }) => {
    //   console.log('===================================== onModeEnter');
    //   const { UserAuthenticationService } = servicesManager.services;
    //   const getAuthorizationHeader = () => {
    //     const accessToken =
    //       'ya29.c.Kp8BEAjgbTZyYziu-QlogmA9kifodl4K4yVC5DhY9aH5_yFnUVhSkqUY6pAvPm-bOQO2yNK_ShqiuU9YSRCNZdcI9lweVBAJ1TfAlLQDwEVLqgRJTsL2HS0VBGnxlV6SLvi-GCjIbiuJkkP-owt9HjHTbRJ3YSgzt9-YU4Anot7shEVhMpPoeTN4s3sFO1jOfxupQsrC9-S-YFTVYp352PSe...............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................';
    //     return {
    //       Authorization: `Bearer ${accessToken}`,
    //     };
    //   };

    //   const handleUnauthenticated = () => {
    //     console.log('handleUnauthenticated');
    //   };

    //   UserAuthenticationService.set({ enabled: true });

    //   UserAuthenticationService.setServiceImplementation({
    //     getAuthorizationHeader,
    //     handleUnauthenticated,
    //   });
    // },
    routes: [
      {
        path: 'lantern',
        // init: ({
        //   servicesManager,
        //   extensionManager,
        //   studyInstanceUIDs,
        //   dataSource,
        // }) => {
        //   const {
        //     DisplaySetService,
        //     HangingProtocolService,
        //     UserAuthenticationService,
        //   } = servicesManager.services;

        //   const getAuthorizationHeader = () => {
        //     const accessToken =
        //       'ya29.c.Kp8BEAjgbTZyYziu-QlogmA9kifodl4K4yVC5DhY9aH5_yFnUVhSkqUY6pAvPm-bOQO2yNK_ShqiuU9YSRCNZdcI9lweVBAJ1TfAlLQDwEVLqgRJTsL2HS0VBGnxlV6SLvi-GCjIbiuJkkP-owt9HjHTbRJ3YSgzt9-YU4Anot7shEVhMpPoeTN4s3sFO1jOfxupQsrC9-S-YFTVYp352PSe...............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................';
        //     return {
        //       Authorization: `Bearer ${accessToken}`,
        //     };
        //   };

        //   const handleUnauthenticated = () => {
        //     console.log('handleUnauthenticated');
        //   };

        //   UserAuthenticationService.setServiceImplementation({
        //     getAuthorizationHeader,
        //     handleUnauthenticated,
        //   });

        //   const unsubscriptions = [];
        //   // TODO: This should be baked into core, not manual?
        //   // DisplaySetService would wire this up?
        //   const {
        //     unsubscribe: instanceAddedUnsubscribe,
        //   } = DicomMetadataStore.subscribe(
        //     DicomMetadataStore.EVENTS.INSTANCES_ADDED,
        //     ({ StudyInstanceUID, SeriesInstanceUID, madeInClient = false }) => {
        //       const seriesMetadata = DicomMetadataStore.getSeries(
        //         StudyInstanceUID,
        //         SeriesInstanceUID
        //       );

        //       DisplaySetService.makeDisplaySets(
        //         seriesMetadata.instances,
        //         madeInClient
        //       );
        //     }
        //   );

        //   unsubscriptions.push(instanceAddedUnsubscribe);

        //   const {
        //     unsubscribe: seriesAddedUnsubscribe,
        //   } = DicomMetadataStore.subscribe(
        //     DicomMetadataStore.EVENTS.SERIES_ADDED,
        //     ({ StudyInstanceUID, madeInClient }) => {
        //       const studyMetadata = DicomMetadataStore.getStudy(
        //         StudyInstanceUID
        //       );
        //       if (!madeInClient) {
        //         HangingProtocolService.run(studyMetadata);
        //       }
        //     }
        //   );
        //   unsubscriptions.push(seriesAddedUnsubscribe);

        //   console.log('StudyInstanceUID', studyInstanceUIDs);
        //   studyInstanceUIDs.forEach(StudyInstanceUID => {
        //     dataSource.retrieveSeriesMetadata({ StudyInstanceUID });
        //   });

        //   return unsubscriptions;
        // },
        layoutTemplate: ({ location, servicesManager }) => {
          return {
            id: ohif.layout,
            props: {
              leftPanels: [tracked.thumbnailList],
              // TODO: Should be optional, or required to pass empty array for slots?
              rightPanels: [tracked.measurements],
              viewports: [
                {
                  namespace: tracked.viewport,
                  displaySetsToDisplay: [ohif.sopClassHandler],
                },
                {
                  namespace: dicomsr.viewport,
                  displaySetsToDisplay: [dicomsr.sopClassHandler],
                },
              ],
            },
          };
        },
      },
    ],
    extensions: [
      'org.ohif.default',
      'org.ohif.cornerstone',
      'org.ohif.measurement-tracking',
      'org.ohif.dicom-sr',
    ],
    hangingProtocols: [ohif.hangingProtocols],
    sopClassHandlers: [ohif.sopClassHandler, dicomsr.sopClassHandler],
    hotkeys: [...hotkeys.defaults.hotkeyBindings],
  };
}

window.lanternMode = mode({});
