  import express from 'express'
  import cors from 'cors'
  import dotenv from 'dotenv'

  dotenv.config()

  const app = express()
  const PORT = 3001

  app.use(cors({
    origin: 'http://localhost:5173'
  }))

  app.use(express.json({ limit: '10mb' }))

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'AdPilot backend is running'
    })
  })
  app.get('/api/meta/test', async (req, res) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.META_AD_ACCOUNT_ID}?fields=id,name,account_status,currency&access_token=${process.env.META_ACCESS_TOKEN}`
      )

      const data = await response.json()

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: data.error?.message || 'Meta API request failed',
          code: data.error?.code || null
        })
      }

      res.json({
        success: true,
        message: 'Meta connection successful',
        account: data
      })
    } catch (error) {
      console.error('Meta connection error:', error.message)

      res.status(500).json({
        success: false,
        error: 'Could not connect to Meta'
      })
    }
  })
  app.post('/api/meta/campaign', async (req, res) => {
    try {
      const {
        name,
        objective,
        status = 'PAUSED'
      } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Campaign name is required'
        })
      }

      const objectiveMap = {
        Awareness: 'OUTCOME_AWARENESS',
        Traffic: 'OUTCOME_TRAFFIC',
        Engagement: 'OUTCOME_ENGAGEMENT',
        Leads: 'OUTCOME_LEADS',
        Sales: 'OUTCOME_SALES',
        'App promotion': 'OUTCOME_APP_PROMOTION'
      }

      const metaObjective = objectiveMap[objective]

      if (!metaObjective) {
        return res.status(400).json({
          success: false,
          error: `Unsupported campaign objective: ${objective}`
        })
      }

      const response = await fetch(
        `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.META_AD_ACCOUNT_ID}/campaigns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            objective: metaObjective,
            status,
            special_ad_categories: [],
            access_token: process.env.META_ACCESS_TOKEN
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('Meta campaign creation failed:', data.error?.message)

        return res.status(response.status).json({
          success: false,
          error: data.error?.message || 'Meta campaign creation failed',
          code: data.error?.code || null
        })
      }

      res.json({
        success: true,
        message: 'Meta campaign created successfully',
        campaign: data
      })
    } catch (error) {
      console.error('Campaign creation error:', error.message)

      res.status(500).json({
        success: false,
        error: 'Could not create Meta campaign'
      })
    }
  })
  app.post('/api/meta/campaign-test', async (req, res) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.META_AD_ACCOUNT_ID}/campaigns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'AdPilot API Test - DELETE ME',
            objective: 'OUTCOME_TRAFFIC',
            status: 'PAUSED',
            special_ad_categories: [],
            access_token: process.env.META_ACCESS_TOKEN
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('Meta test campaign failed:', data.error?.message)

        return res.status(response.status).json({
          success: false,
          error: data.error?.message || 'Meta test campaign failed',
          code: data.error?.code || null
        })
      }

      res.json({
        success: true,
        message: 'Test campaign created successfully',
        campaign: data
      })
    } catch (error) {
      console.error('Test campaign error:', error.message)

      res.status(500).json({
        success: false,
        error: 'Could not create test campaign'
      })
    }
  })
  app.listen(PORT, () => {
    console.log(`AdPilot backend running at http://localhost:${PORT}`)
  })