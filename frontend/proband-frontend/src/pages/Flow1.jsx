import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlowHelper from "../utility/FlowHelper";

const Flow1 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectFlow = async () => {
      console.log("Flow1 page loaded");
      
      try {
        await FlowHelper.setFlowPage("Flow1");
      
        const visitedSize = await FlowHelper.getVisitedSize();
        console.log(`Visited size: ${visitedSize}`);
       
        if (visitedSize === 0) {
          console.log("Redirecting to Pre questionnaire...");
          navigate("/PrequestionnaireStandard", { replace: true });
        } else if (visitedSize === 1) {
          const hasVisited = await FlowHelper.checkVisited("PrequestionnaireStandard");
          
          if (hasVisited === true) {
            console.log("Redirecting to FittsTaskStandard...");
            navigate("/FittsTaskStandard", { replace: true });
          } else {
            console.log("Redirecting to End...");
            navigate("/End", { replace: true });
          }
        } else if (visitedSize === 2) {
          const hasVisited = await FlowHelper.checkVisited("FittsTaskStandard");
      
          if (hasVisited === true) {
            navigate("/PostquestionnaireStandard", { replace: true });
          } else {
            console.log("Redirecting to End...");
            navigate("/End", { replace: true });
          }
        } else if (visitedSize === 3) {
          const hasVisited = await FlowHelper.checkVisited("PostquestionnaireStandard");
      
          if (hasVisited === true) {
            navigate("/PrequestionnaireML", { replace: true });
          }
        }
        else if (visitedSize === 4) {
          const hasVisited = await FlowHelper.checkVisited("PrequestionnaireML");

          if (hasVisited === true) {
            console.log("Redirecting to FittsTaskML...");
            navigate("/FittsTaskML", { replace: true });
          }
        }
        else if (visitedSize === 5) {
          const hasVisited = await FlowHelper.checkVisited("FittsTaskML");

          if (hasVisited === true) { 
            navigate("/PostquestionnaireML", { replace: true });
          }
        }
        else if (visitedSize === 6) {
          const hasVisited = await FlowHelper.checkVisited("PostquestionnaireML");
          
          if (hasVisited === true) {
            navigate("/PrequestionnairePhysical", { replace: true });
          }
        }
        else if (visitedSize === 7) {
          const hasVisited = await FlowHelper.checkVisited("PrequestionnairePhysical");

          if (hasVisited === true) {
            console.log("Redirecting to FittsTaskPhysical...");
            navigate("/FittsTaskPhysical", { replace: true });
          }
        }
        else if (visitedSize === 8) {
          const hasVisited = await FlowHelper.checkVisited("FittsTaskPhysical");

          if (hasVisited === true) {
            navigate("/PostquestionnairePhysical", { replace: true });
          }
        }
        else if (visitedSize === 9) {
          const hasVisited = await FlowHelper.checkVisited("PostquestionnairePhysical");

          if (hasVisited === true) {
            console.log("Redirecting to End...");
            navigate("/End", { replace: true });
          }
        }


      } catch (error) {
        console.error("An error occurred in flow handling:", error);
      }
      
    };

    redirectFlow();
  }, [navigate]);

  return null; // No UI, just redirection
};

export default Flow1;
