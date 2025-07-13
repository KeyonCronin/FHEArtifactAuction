# Testing Guide

Comprehensive testing guide for the Confidential Artifact Auction smart contract.

## Table of Contents

- [Overview](#overview)
- [Test Infrastructure](#test-infrastructure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)

## Overview

The project includes comprehensive test coverage with over 45 test assertions covering:
- Contract deployment and initialization
- Authenticator management
- Auction creation and validation
- Artifact authentication
- Bidding functionality
- Access control
- Edge cases and boundary conditions
- Gas optimization

## Test Infrastructure

### Technology Stack

- **Hardhat**: Testing framework and development environment
- **Chai**: Assertion library for test expectations
- **Hardhat Network Helpers**: Time manipulation and test utilities
- **Solidity Coverage**: Code coverage reporting
- **Solhint**: Solidity linting
- **Gas Reporter**: Gas usage analysis

### Dependencies

All testing dependencies are included in `package.json`:

```json
{
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^2.0.0",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.0",
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "chai": "^4.3.10",
    "hardhat": "^2.22.0",
    "hardhat-gas-reporter": "^2.0.0",
    "solhint": "^4.5.0",
    "solidity-coverage": "^0.8.0"
  }
}
```

## Running Tests

### Basic Test Execution

Run all tests:

```bash
npm test
```

### Coverage Report

Generate code coverage report:

```bash
npm run coverage
```

This will:
- Run all tests
- Generate coverage metrics
- Create HTML report in `coverage/` directory
- Generate `coverage/lcov.info` for CI/CD

### Linting

Check Solidity code quality:

```bash
npm run lint:sol
```

Auto-fix linting issues:

```bash
npm run lint:sol:fix
```

### Gas Reporting

Run tests with gas reporting:

```bash
REPORT_GAS=true npm test
```

## Test Coverage

### Current Coverage

The test suite includes **45+ test assertions** covering:

| Category | Tests | Description |
|----------|-------|-------------|
| Deployment | 4 | Contract initialization and setup |
| Authenticator Management | 4 | Adding/removing authenticators |
| Auction Creation | 6 | Creating auctions with validation |
| Artifact Authentication | 3 | Authentication workflow |
| Bidding | 6 | Bid placement and validation |
| Active Auctions | 3 | Auction lifecycle management |
| Artifact Details | 2 | Data retrieval |
| Edge Cases | 3 | Boundary conditions |
| Gas Optimization | 2 | Performance testing |

### Coverage Goals

- **Target**: 70% code coverage
- **Minimum**: 60% coverage
- **Critical paths**: 100% coverage

## Test Structure

### File Organization

```
test/
└── ConfidentialArtifactAuction.test.js    # Main test file
```

### Test Organization

Tests are organized using `describe` blocks:

```javascript
describe("ConfidentialArtifactAuction", function () {
  describe("Deployment", function () {
    // Deployment tests
  });

  describe("Authenticator Management", function () {
    // Access control tests
  });

  describe("Auction Creation", function () {
    // Auction creation tests
  });

  describe("Bidding", function () {
    // Bidding functionality tests
  });

  // ... more test suites
});
```

### Test Patterns

#### 1. Deployment Fixture

Each test uses a fresh contract instance:

```javascript
async function deployAuctionFixture() {
  const [deployer, seller, authenticator, bidder1, bidder2, bidder3] =
    await ethers.getSigners();

  const ConfidentialArtifactAuction = await ethers.getContractFactory(
    "ConfidentialArtifactAuction"
  );
  const auction = await ConfidentialArtifactAuction.deploy();
  await auction.waitForDeployment();

  return { auction, deployer, seller, authenticator, bidder1, bidder2, bidder3 };
}

beforeEach(async function () {
  const fixture = await loadFixture(deployAuctionFixture);
  auction = fixture.auction;
  // ... assign signers
});
```

#### 2. Multiple Signers

Tests use different accounts for role-based testing:

```javascript
const signers = {
  deployer: ethers.getSigners()[0],
  seller: ethers.getSigners()[1],
  authenticator: ethers.getSigners()[2],
  bidder1: ethers.getSigners()[3],
  bidder2: ethers.getSigners()[4],
  bidder3: ethers.getSigners()[5]
};
```

#### 3. Event Testing

Verify events are emitted correctly:

```javascript
it("should emit AuctionCreated event", async function () {
  const tx = await auction.createAuction(...params);
  await expect(tx).to.emit(auction, "AuctionCreated");
});
```

#### 4. Revert Testing

Test error conditions:

```javascript
it("should reject non-owner calls", async function () {
  await expect(
    auction.connect(signers.seller).ownerOnlyFunction()
  ).to.be.revertedWith("Not authorized");
});
```

#### 5. Gas Optimization Testing

Monitor gas usage:

```javascript
it("should have reasonable deployment cost", async function () {
  const deployment = await ConfidentialArtifactAuction.deploy();
  const receipt = await deployment.deploymentTransaction().wait();

  expect(receipt.gasUsed).to.be.lt(5000000); // Less than 5M gas
});
```

## Writing Tests

### Best Practices

#### 1. Descriptive Test Names

```javascript
// ✅ Good - clear and descriptive
it("should reject auction with zero minimum bid", async function () {});

// ❌ Bad - unclear
it("test1", async function () {});
```

#### 2. One Assertion Per Test

```javascript
// ✅ Good - focused test
it("should set deployer as owner", async function () {
  expect(await auction.owner()).to.equal(deployer.address);
});

// ❌ Bad - multiple concerns
it("should set everything correctly", async function () {
  expect(await auction.owner()).to.equal(deployer.address);
  expect(await auction.currentAuctionId()).to.equal(0);
  expect(await auction.authenticators(deployer.address)).to.be.true;
});
```

#### 3. Test Both Success and Failure Cases

```javascript
describe("Auction Creation", function () {
  it("should create auction successfully", async function () {
    // Test success path
  });

  it("should reject auction with zero minimum bid", async function () {
    // Test failure path
  });
});
```

#### 4. Use Fixtures for Setup

```javascript
beforeEach(async function () {
  const fixture = await loadFixture(deployAuctionFixture);
  auction = fixture.auction;
  // Initialize test state
});
```

#### 5. Clean Up After Tests

```javascript
afterEach(async function () {
  // Clean up resources if needed
});
```

### Adding New Tests

1. Create new test file in `test/` directory
2. Follow the existing test structure
3. Use descriptive `describe` and `it` blocks
4. Include setup in `beforeEach`
5. Test both success and failure cases
6. Run tests and verify coverage

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:
- Push to `main` or `develop` branches
- All pull requests
- Multiple Node.js versions (18.x, 20.x)

### Workflow Steps

1. **Code Checkout**: Clone repository
2. **Node.js Setup**: Install Node.js
3. **Dependencies**: Install npm packages
4. **Linting**: Run Solhint
5. **Compilation**: Compile contracts
6. **Testing**: Run test suite
7. **Coverage**: Generate coverage report
8. **Upload**: Send coverage to Codecov

### Codecov Integration

Coverage reports are automatically uploaded to Codecov:
- **Target**: 70% coverage
- **Threshold**: 5% change tolerance
- **Comments**: Posted on pull requests

### Configuration

**GitHub Actions** (`.github/workflows/test.yml`):
```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

**Codecov** (`codecov.yml`):
```yaml
coverage:
  status:
    project:
      default:
        target: 70%
        threshold: 5%
```

**Solhint** (`.solhint.json`):
```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["error", "^0.8.0"]
  }
}
```

## Test Execution Examples

### Run Specific Test File

```bash
npx hardhat test test/ConfidentialArtifactAuction.test.js
```

### Run Tests with Verbose Output

```bash
npx hardhat test --verbose
```

### Run Tests on Specific Network

```bash
npx hardhat test --network localhost
```

### Watch Mode (requires additional setup)

```bash
npx hardhat watch test
```

## Troubleshooting

### Common Issues

**1. Tests Failing Locally**

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
npm test
```

**2. Coverage Not Generating**

```bash
# Ensure coverage plugin is installed
npm install --save-dev solidity-coverage
npx hardhat coverage
```

**3. Gas Estimation Errors**

```bash
# Increase timeout in hardhat.config.js
mocha: {
  timeout: 40000
}
```

**4. Network Connection Issues**

```bash
# Start local node first
npm run node

# In another terminal
npm test
```

## Additional Resources

- [Hardhat Testing Docs](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)
- [Chai Assertion Docs](https://www.chaijs.com/api/bdd/)
- [Hardhat Network Helpers](https://hardhat.org/hardhat-network-helpers/docs/overview)
- [Solidity Coverage](https://github.com/sc-forks/solidity-coverage)

## Test Checklist

Before committing code, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Coverage meets threshold (`npm run coverage`)
- [ ] Linting passes (`npm run lint:sol`)
- [ ] Gas usage is acceptable (`REPORT_GAS=true npm test`)
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Documentation is updated

---

**Last Updated:** October 2024
